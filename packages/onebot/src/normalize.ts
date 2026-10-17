import { modelFields } from "./model-fields.js";

/** 旧 Java 通用接口把数组、标量和空值包在 data 键下。 */
export function asMap(input: unknown): Record<string, unknown> {
  return input && typeof input === "object" && !Array.isArray(input)
    ? (input as Record<string, unknown>)
    : { data: input ?? null };
}
export function responseId(input: unknown): number {
  if (input === null || input === undefined) return 0;
  const value = typeof input === "number" ? Math.trunc(input) : Number(input);
  if (!Number.isFinite(value) || !Number.isInteger(value)) return 0;
  if (!Number.isSafeInteger(value)) throw new Error("响应包含不安全整数");
  return value;
}
function booleanValue(value: unknown): boolean {
  if (typeof value === "boolean") return value;
  if (typeof value === "number") return Math.trunc(value) !== 0;
  return (
    typeof value === "string" &&
    ["1", "true"].includes(value.trim().toLowerCase())
  );
}
function fieldValue(kind: string, value: unknown): unknown {
  if (kind === "boolean") return booleanValue(value);
  if (["long", "int", "double"].includes(kind)) {
    if (value == null) return 0;
    if (typeof value !== "string" && typeof value !== "number")
      throw new Error("模型数字字段格式错误");
    if (
      typeof value === "string" &&
      (!value.trim() || (kind !== "double" && !/^[+-]?\d+$/.test(value)))
    )
      throw new Error("模型数字字段格式错误");
    const number = Number(value);
    if (!Number.isFinite(number)) throw new Error("模型数字字段格式错误");
    const result = kind === "double" ? number : Math.trunc(number);
    if (kind !== "double" && !Number.isSafeInteger(result))
      throw new Error("响应包含不安全整数");
    return kind === "int" ? result | 0 : result;
  }
  if (value == null) return null;
  if (kind === "String") {
    if (["string", "number", "boolean"].includes(typeof value))
      return String(value);
    throw new Error("模型字符串字段格式错误");
  }
  if (Object.hasOwn(modelFields, kind)) return normalizeModel(kind, value);
  if (kind.startsWith("List<")) {
    if (!Array.isArray(value)) throw new Error("模型列表字段格式错误");
    return value;
  }
  return value;
}
/** 对齐 Gson 的具名模型字段、引用空值、原始类型缺省值及嵌套转换。 */
export function normalizeModel<T>(name: string, input: T): T {
  if (input == null) return null as T;
  const fields = modelFields[name];
  if (!fields) return input;
  if (typeof input !== "object" || Array.isArray(input))
    throw new Error("模型应为对象");
  const source = input as Record<string, unknown>;
  const result: Record<string, unknown> = {};
  for (const [field, kind] of Object.entries(fields))
    result[field] = fieldValue(kind, source[field]);
  return result as T;
}
