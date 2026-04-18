import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Input } from "../components/ui";
import { toast } from "@heroui/react";
import { apiCall, setAdminToken } from "../api/client";

interface LoginResp {
  token: string;
  expiresAt: number;
}

export default function LoginPage() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!password) return;
    setLoading(true);
    const data = await apiCall<LoginResp>("POST", "/api/auth/login", {
      password,
    });
    setLoading(false);
    if (data?.token) {
      setAdminToken(data.token);
      toast.success("登录成功");
      navigate("/dashboard", { replace: true });
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-sm rounded-xl p-8 bg-[rgba(15,20,25,0.72)] backdrop-blur-[20px] border border-[var(--glass-border)] shadow-xl space-y-6"
      >
        <div className="space-y-1 text-center">
          <h1 className="text-lg font-semibold text-[var(--color-text-primary)]">
            管理员登录
          </h1>
          <p className="text-xs text-[var(--color-text-muted)]">
            请输入管理员密码以进入控制台
          </p>
        </div>
        <Input
          label="管理员密码"
          type="password"
          placeholder="请输入管理员密码"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoFocus
          fullWidth
        />
        <Button
          type="submit"
          variant="primary"
          disabled={loading || !password}
          fullWidth
        >
          {loading ? "登录中…" : "登录"}
        </Button>
      </form>
    </div>
  );
}
