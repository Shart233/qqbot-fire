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
  opts?: { silent?: boolean },
): Promise<T | null> {
  const silent = opts?.silent === true;
  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    const token = getAdminToken();
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const reqOpts: RequestInit = { method, headers };
    if (body) reqOpts.body = JSON.stringify(body);
    const res = await fetch(path, reqOpts);

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
      if (!silent) {
        toast.danger("请求失败", { description: json.error || "未知错误" });
      }
      return null;
    }
    return json.data as T;
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "未知错误";
    if (!silent) toast.danger("网络错误", { description: msg });
    return null;
  }
}

// 对按钮操作统一包装：成功时弹 toast.success；失败路径不介入（apiCall 已弹 danger）
export async function runAction<T>(
  successMessage: string,
  fn: () => Promise<T | null>,
): Promise<T | null> {
  const data = await fn();
  if (data !== null) toast.success(successMessage);
  return data;
}
