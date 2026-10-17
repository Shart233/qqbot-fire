"""从保留的 Java API 生成显式 TypeScript 方法；协议行为由独立集成测试验证。"""
from pathlib import Path
import re, json

root=Path(__file__).resolve().parents[2]
source=(root/'src/onebot/client/OneBotClient.java').read_text()
def split_args(text):
    parts=[];start=0;depth=0;quoted=False;escaped=False
    for i,c in enumerate(text):
        if quoted:
            if escaped:escaped=False
            elif c=='\\':escaped=True
            elif c=='"':quoted=False
        elif c=='"':quoted=True
        elif c in '(<[':depth+=1
        elif c in ')>]':depth-=1
        elif c==',' and depth==0:parts.append(text[start:i].strip());start=i+1
    tail=text[start:].strip()
    if tail:parts.append(tail)
    return parts

def paired(text,start,opening='(',closing=')'):
    depth=1;quote=False;escape=False
    for i in range(start,len(text)):
        c=text[i]
        if quote:
            if escape:escape=False
            elif c=='\\':escape=True
            elif c=='"':quote=False
        elif c=='"':quote=True
        elif c==opening:depth+=1
        elif c==closing:
            depth-=1
            if depth==0:return text[start:i],i
    raise ValueError('未闭合代码')

def ts_type(kind):
    kind=kind.strip()
    if kind in ('long','int','double','Long','Integer'):return 'number'
    if kind in ('boolean','Boolean'):return 'boolean'
    if kind=='String':return 'string'
    if kind=='Object':return 'unknown'
    if kind=='void':return 'void'
    if kind.startswith('List<'):return ts_type(kind[5:-1])+'[]'
    if kind.startswith('Map<'):
        args=split_args(kind[4:-1]);return 'Record<string, '+ts_type(args[1])+'>'
    return kind

def expr(value):
    value=value.strip()
    value=re.sub(r'String.valueOf\((\w+)\)',r'String(safeId(\1))',value)
    value=re.sub(r'segmentsToList\((\w+)\)',r'segments(\1)',value)
    value=re.sub(r'(\d+)L\b',r'\1',value)
    return value.replace(' != null',' != null')

known_models={p.stem for p in (root/'src/onebot/model').glob('*.java')} - {'BaseResponse','SendMsgResult'}
model_names={'MessageSegment'};methods=[];skipped=[]
for match in re.finditer(r'    public ([\w<>, ?]+) (\w+)\((.*?)\) \{',source,re.S):
    result,name,parameters=match.groups()
    if '\n' in result:continue
    body,_=paired(source,match.end(),'{','}')
    if name in ('getProvider','callApi','callApiRaw'):continue
    if name in ('sendPrivateMsg','sendGroupMsg') and 'String text' in parameters:continue
    action=re.search(r'callApi(?:Raw)?\("([^"]+)"',body)
    if not action:skipped.append(name);continue
    arguments=[]
    for raw in split_args(parameters):
        kind,arg=raw.rsplit(' ',1);kind=kind.strip()
        nullable=bool(re.search(r'\b'+arg+r'\s*[!=]=\s*null',body))
        typ=ts_type(kind)
        if kind=='MessageSegment':model_names.add(kind)
        if kind=='List<MessageSegment>' and name in ('sendPrivateMsg','sendGroupMsg'):typ='MessageSegment[] | string'
        if nullable:typ+=' | null | undefined'
        arguments.append(arg+': '+typ)
    ret=ts_type(result)
    if re.fullmatch(r'\w+',ret) and ret not in ('void','number','boolean','unknown'):model_names.add(ret)
    if ret.endswith('[]') and re.fullmatch(r'\w+',ret[:-2]) and ret[:-2] not in ('string','number','unknown'):model_names.add(ret[:-2])
    lines=[]
    if 'params.put(' in body:
        lines.append('    const params:Record<string,unknown>={};')
        for line in body.splitlines():
            put=re.search(r'params.put\("([^"]+)",\s*(.*)\);',line)
            if not put:continue
            key,value=put.groups();condition=re.search(r'if \((\w+) != null\)',line)
            statement=f'params["{key}"]={expr(value)};'
            lines.append('    '+(f'if({condition[1]}!=null)' if condition else '')+statement)
    else:
        map_match=re.search(r'Map.of\(',body)
        if map_match:
            mapping,_=paired(body,map_match.end());entries=split_args(mapping)
            assert len(entries)%2==0,name
            pairs=[entries[i]+':'+expr(entries[i+1]) for i in range(0,len(entries),2)]
            lines.append('    const params={'+','.join(pairs)+'};')
        else:lines.append('    const params={};')
    invocation='this.invoke<'+('Record<string,unknown>' if ret in ('number','boolean') or 'Object messages =' in body else ret if ret!='void' else 'unknown')+'>("'+action[1]+'",params'+(',true' if 'callApiRaw(' in body else '')+')'
    if ret=='void':lines.append('    await '+invocation+';')
    elif ret=='number':lines.append('    const data=await '+invocation+';return responseId(data.message_id);')
    elif ret=='boolean':lines.append('    try{const data=await '+invocation+';return data.yes===true;}catch{return false;}')
    elif 'Object messages =' in body:lines.append('    const data=await '+invocation+';return Array.isArray(data.messages)?data.messages as '+ret+':[];')
    elif ret.endswith('[]'):
        element=ret[:-2]
        normalized='data.map(item=>normalizeModel<'+element+'>(\"'+element+'\",item))' if element in known_models else 'data'
        lines.append('    const data=await '+invocation+';return Array.isArray(data)?'+normalized+':[];')
    else:lines.append('    return '+('normalizeModel<'+ret+'>(\"'+ret+'\",await '+invocation+')' if ret in known_models else invocation)+';')
    declared_ret=('('+ret[:-2]+' | null)[]') if ret.endswith('[]') and ret[:-2] in known_models else ret
    methods.append('  async '+name+'('+', '.join(arguments)+'):Promise<'+declared_ret+'> {\n'+'\n'.join(lines)+'\n  }')

assert not skipped,skipped
# 模型字段沿用 OneBot 的 snake_case；不转换为管理端 DTO。
models=['export type MessageSegment={type:string;data:Record<string,unknown>};']
metadata={}
for file in sorted((root/'src/onebot/model').glob('*.java')):
    name=file.stem
    if name in ('BaseResponse','SendMsgResult'):continue
    fields=re.findall(r'    private ([\w<>, ]+) (\w+);',file.read_text())
    metadata[name]={field:kind for kind,field in fields}
    models.append('export interface '+name+' { '+ '; '.join(field+':'+ts_type(kind)+(' | null' if kind not in ('long','int','double','boolean') else '') for kind,field in fields)+' }')
(root/'packages/onebot/src/models.ts').write_text('// 由 Java 协议模型生成，字段保持 OneBot 原名。\n'+'\n'.join(models)+'\n')
(root/'packages/onebot/src/model-fields.ts').write_text('// 由 Java 模型生成，供运行时兼容转换使用。\nexport const modelFields:Record<string,Record<string,string>>='+json.dumps(metadata,ensure_ascii=False,indent=2)+';\n')
header='''// 由 scripts/migration/generate-onebot-client.py 生成；修改后运行客户端兼容测试。
import { normalizeModel, asMap, responseId } from './normalize.js';
import { safeId, type Transport } from './index.js';
import type { '''+', '.join(sorted(model_names))+''' } from './models.js';
function segments(input:MessageSegment[]|string){return typeof input==='string'?[{type:'text',data:{text:input}}]:input;}
function validateNumbers(input:unknown):void{
  if(typeof input==='number'&&!Number.isSafeInteger(input))throw new Error('参数必须为安全整数');
  if(Array.isArray(input))for(const value of input)validateNumbers(value);
  else if(input&&typeof input==='object')for(const value of Object.values(input))validateNumbers(value);
}
export class OneBotClient {
  constructor(readonly provider:Transport){}
  getProvider(){return this.provider;}
  private async invoke<T>(action:string,params:Record<string,unknown>,raw=false):Promise<T>{validateNumbers(params);const data=await this.provider.call<unknown>(action,params);return (raw?data:asMap(data)) as T;}
  callApi(action:string,params:Record<string,unknown>={}){return this.invoke<Record<string,unknown>>(action,params);}
  callApiRaw(action:string,params:Record<string,unknown>={}){return this.invoke<unknown>(action,params,true);}
'''
(root/'packages/onebot/src/client.ts').write_text(header+'\n'.join(methods)+'\n}\n')
print('已生成显式 API 方法：',len(methods))
