import { toast } from "@heroui/react";

const TOKEN_KEY = "adminToken";

export function getAdminToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setAdminToken(token: string) {
  try {
    localStorage.setItem(TOKEN_KEY, token);
  } catch {
    /* ignore */
  }
}

export function clearAdminToken() {
  try {
    localStorage.removeItem(TOKEN_KEY);
  } catch {
    /* ignore */
  }
}

function redirectToLogin() {
  const target = "#/login";
  if (window.location.hash !== target) {
    window.location.hash = target;
  }
}

export async function apiCall<T>(
  method: string,
  path: string,
  body?: unknown,
): Promise<T | null> {
  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    const token = getAdminToken();
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const opts: RequestInit = { method, headers };
    if (body) opts.body = JSON.stringify(body);
    const res = await fetch(path, opts);

    if (res.status === 401) {
      clearAdminToken();
      // 登录/初始化相关端点自行处理错误；其他端点 401 即跳登录
      if (!path.startsWith("/api/auth/")) {
        redirectToLogin();
        return null;
      }
    }

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
