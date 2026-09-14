import { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { getNapCatLogin, listNapCatInstances, refreshNapCatLogin, startNapCat } from "../api/endpoints";
import type { NapCatInstance, NapCatLoginStatus } from "../api/types";
import { PageContainer, PageHeader } from "../components/layout-new";
import { Button, Select, Spinner } from "../components/ui";

export default function NcLoginPage() {
  const [params, setParams] = useSearchParams();
  const [instances, setInstances] = useState<NapCatInstance[]>([]);
  const [loading, setLoading] = useState(true);
  const [listError, setListError] = useState(false);
  const selected = params.get("instance") || "";

  useEffect(() => {
    let cancelled = false;
    void listNapCatInstances({ silent: true }).then((data) => {
      if (cancelled) return;
      setListError(data === null);
      setInstances(data || []);
      setLoading(false);
      if (!selected && data?.length) {
        const initial = data.find((item) => item.alive) || data[0];
        setParams({ instance: initial.name }, { replace: true });
      }
    });
    return () => { cancelled = true; };
  }, [selected, setParams]);

  return (
    <PageContainer>
      <PageHeader title="QQ 扫码登录" description="打开手机 QQ，扫描下方二维码完成登录。" actions={
        <Link to="/napcat" className="text-sm text-neutral-400 hover:text-white">管理 NapCat →</Link>
      } />
      <div className="mb-6 max-w-sm">
        <label htmlFor="login-instance" className="mb-2 block text-xs text-neutral-400">选择登录实例</label>
        <Select id="login-instance" fullWidth value={selected}
          options={[{ value: "", label: "请选择实例" }, ...instances.map((item) => ({
            value: item.name, label: `${item.name} · QQ ${item.qqUin || "未设置"}`,
          }))]}
          onChange={(event) => setParams({ instance: event.target.value })} />
      </div>
      {loading ? <div className="py-20 flex justify-center"><Spinner size="lg" /></div>
        : listError ? <p role="alert" className="text-amber-300">实例列表加载失败，请刷新页面重试。</p>
        : selected ? <LoginPanel key={selected} name={selected} />
        : <div className="rounded-2xl border border-white/10 p-10 text-center">
          <p className="text-neutral-300">还没有 NapCat 实例</p>
          <Link to="/napcat" className="mt-3 inline-block text-sm text-[#8da5ff]">前往创建实例 →</Link>
        </div>}
    </PageContainer>
  );
}

/** 切换实例时重新挂载，旧请求和旧二维码不会出现在新实例下。 */
function LoginPanel({ name }: { name: string }) {
  const [status, setStatus] = useState<NapCatLoginStatus | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [hideQr, setHideQr] = useState(false);
  const pendingQr = useRef<{ version: string; since: number } | null>(null);
  const mounted = useRef(false);

  useEffect(() => {
    mounted.current = true;
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout>;
    const poll = async () => {
      const data = await getNapCatLogin(name);
      if (cancelled) return;
      if (!data) {
        setStatus(null);
        setError("登录信息获取失败，请检查实例是否存在及网络连接。页面会自动重试。");
      } else {
        setStatus(data);
        const pending = pendingQr.current;
        if (pending && (data.state === "logged_in" || (data.qrVersion && data.qrVersion !== pending.version))) {
          pendingQr.current = null;
          setHideQr(false);
          setRefreshing(false);
          setError("");
        } else if (pending && Date.now() - pending.since > 20000) {
          setRefreshing(false);
          setError("NapCat 尚未生成新二维码，请再次刷新；若仍无变化，请到 NapCat 页面重启此实例。");
        } else if (!pending) {
          setError("");
        }
      }
      timer = setTimeout(poll, 2500);
    };
    void poll();
    return () => { cancelled = true; mounted.current = false; clearTimeout(timer); };
  }, [name]);

  async function refresh() {
    if (!status) return;
    setBusy(true);
    setRefreshing(true);
    setHideQr(true);
    setError("");
    pendingQr.current = { version: status.qrVersion, since: Date.now() };
    const data = await refreshNapCatLogin(name);
    if (!mounted.current) return;
    setBusy(false);
    if (!data) {
      pendingQr.current = null;
      setHideQr(false);
      setRefreshing(false);
      setError("刷新请求失败，请稍后重试，或查看实例日志。");
    }
  }

  async function start() {
    setBusy(true);
    const data = await startNapCat(name);
    if (!mounted.current) return;
    setBusy(false);
    if (!data) setError("实例启动失败，请查看 NapCat 配置和服务端日志。");
  }

  const loggedIn = status?.state === "logged_in";
  const qrImage = !hideQr && status?.state === "qr_ready" ? status.qrImage : "";
  const title = loggedIn ? "登录成功" : status?.state === "stopped" ? "实例尚未启动"
    : refreshing ? "正在生成新二维码" : qrImage ? "等待扫码" : status?.state === "error" ? "登录需要处理" : "等待二维码";

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(300px,440px)_1fr] lg:gap-12">
      <section className="min-w-0 overflow-hidden rounded-2xl border border-white/10 bg-[rgba(15,20,25,0.6)]">
        <div className="flex items-center justify-between gap-3 border-b border-white/10 px-5 py-4">
          <span className="truncate text-sm font-medium text-white">{name}</span>
          <span className={`flex shrink-0 items-center gap-2 text-xs ${loggedIn ? "text-emerald-300" : "text-neutral-400"}`}>
            <span className={`h-1.5 w-1.5 rounded-full ${loggedIn ? "bg-emerald-400" : "bg-amber-300"}`} />{title}
          </span>
        </div>
        <div className="p-5 sm:p-8">
          <div className="mx-auto flex aspect-square w-full max-w-[320px] items-center justify-center rounded-xl bg-white p-5 text-center text-slate-700">
            {qrImage ? <img src={qrImage} alt={`${name} 的 QQ 登录二维码`} className="block h-full w-full object-contain [image-rendering:pixelated]" />
              : <div className="flex flex-col items-center gap-4 px-3">
                {loggedIn ? <svg width="64" height="64" viewBox="0 0 64 64" fill="none" aria-hidden="true"><circle cx="32" cy="32" r="29" fill="#ecfdf5" /><path d="m19 32 9 9 18-19" stroke="#059669" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  : !error && status?.state !== "stopped" && status?.state !== "error" ? <Spinner size="lg" /> : null}
                <span className="text-sm font-medium">{error ? "暂时无法显示二维码" : title}</span>
              </div>}
          </div>
          <div aria-live="polite" className="mt-5 min-h-12 text-center text-sm leading-6 text-neutral-400">
            {refreshing ? "刷新请求已发出，等待 NapCat 返回新图片…" : status?.message || "正在读取登录信息…"}
          </div>
          {error && <p role="alert" className="mt-3 text-sm leading-6 text-amber-300">{error}</p>}
          <div className="mt-5 flex flex-wrap justify-center gap-3">
            {status?.state === "stopped" ? <Button loading={busy} onClick={start}>启动实例并获取二维码</Button>
              : loggedIn ? <Link to="/bots" className="rounded-lg bg-emerald-500/15 px-5 py-3 text-sm text-emerald-300">查看 Bot 连接 →</Link>
              : <>
                <Button onClick={refresh} loading={busy || refreshing} disabled={!status?.canRefresh}>刷新二维码</Button>
                {qrImage && <a href={qrImage} download={`qq-login-${name}.png`} className="inline-flex h-10 items-center rounded-lg border border-white/10 px-4 text-sm text-white hover:bg-white/5">保存二维码</a>}
              </>}
          </div>
        </div>
        <div className="border-t border-white/10 px-5 py-3 text-center text-xs text-neutral-500">每 2.5 秒自动检测 · 登录后自动隐藏二维码</div>
      </section>
      <aside className="py-2 lg:py-8">
        <p className="mb-3 text-xs tracking-[0.2em] text-[#8da5ff]">手机 QQ 登录</p>
        <h2 className="text-2xl font-semibold tracking-tight text-white">扫码，确认，即可登录。</h2>
        <ol className="mt-8 space-y-7">
          {[
            ["打开扫一扫", "在手机 QQ 右上角点击「+」，选择「扫一扫」。"],
            ["扫描清晰二维码", "用另一部手机扫描左侧图片。如果正在本机浏览，保存二维码后，从 QQ 扫一扫的相册中选择图片。"],
            ["在 QQ 中确认登录", "按手机提示完成确认或安全验证。此页面会自动显示登录结果，无需反复刷新网页。"],
          ].map(([heading, detail], index) => <li key={heading} className="flex gap-4">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-white/15 text-xs text-neutral-400">{index + 1}</span>
            <div><h3 className="text-sm font-medium text-neutral-200">{heading}</h3><p className="mt-1.5 max-w-md text-sm leading-6 text-neutral-400">{detail}</p></div>
          </li>)}
        </ol>
        <div className="mt-9 border-t border-white/10 pt-5 text-sm leading-6 text-neutral-400">
          <p>提示二维码失效时，点击「刷新二维码」再扫描。手机浏览器也可以长按图片保存。</p>
          <Link to={`/nc-logs?instance=${encodeURIComponent(name)}`} className="mt-3 inline-block text-[#8da5ff] hover:text-white">查看此实例日志 →</Link>
        </div>
      </aside>
    </div>
  );
}
