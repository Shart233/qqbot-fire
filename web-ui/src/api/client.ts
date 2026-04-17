import { toast } from "@heroui/react";

export async function apiCall<T>(
  method: string,
  path: string,
  body?: unknown,
): Promise<T | null> {
  try {
    const opts: RequestInit = {
      method,
      headers: { "Content-Type": "application/json" },
    };
    if (body) opts.body = JSON.stringify(body);
    const res = await fetch(path, opts);
    const json = await res.json();
    if (!json.ok) {
      toast.danger("请求失败", { description: json.error || "未知错误" });
      return null;
    }
    return json.data as T;
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "未知错误";
    toast.danger("网络错误", { description: msg });
    return null;
  }
}
