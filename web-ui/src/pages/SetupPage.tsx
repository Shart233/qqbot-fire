import { AuthLayout } from "../components/layout-new/AuthLayout";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Input } from "../components/ui";
import { toast } from "@heroui/react";
import { apiCall, setAdminToken } from "../api/client";

interface SetupResp {
  token: string;
  expiresAt: number;
}

export default function SetupPage() {
  const navigate = useNavigate();
  const [pwd1, setPwd1] = useState("");
  const [pwd2, setPwd2] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (pwd1.length < 6) {
      toast.danger("密码至少 6 位");
      return;
    }
    if (pwd1 !== pwd2) {
      toast.danger("两次输入的密码不一致");
      return;
    }
    setLoading(true);
    const data = await apiCall<SetupResp>("POST", "/api/auth/setup", {
      password: pwd1,
    });
    setLoading(false);
    if (data?.token) {
      setAdminToken(data.token);
      toast.success("密码已设置");
      navigate("/dashboard", { replace: true });
    }
  }

  return (
    <AuthLayout>
      <form
        onSubmit={onSubmit}
        className="space-y-6"
      >
        <div className="space-y-1 text-left">
          <h1 className="text-2xl font-semibold text-[var(--color-text-primary)]">
            初始化管理员密码
          </h1>
          <p className="text-xs text-[var(--color-text-muted)]">
            首次启动请设置管理员密码（至少 6 位）
          </p>
        </div>
        <Input
          label="新密码"
          type="password"
          autoComplete="new-password"
          placeholder="至少 6 位"
          value={pwd1}
          onChange={(e) => setPwd1(e.target.value)}
          autoFocus
          fullWidth
        />
        <Input
          label="确认新密码"
          type="password"
          autoComplete="new-password"
          placeholder="再次输入新密码"
          value={pwd2}
          onChange={(e) => setPwd2(e.target.value)}
          fullWidth
        />
        <Button
          type="submit"
          variant="primary"
          disabled={loading || !pwd1 || !pwd2}
          fullWidth
        >
          {loading ? "设置中…" : "确认并进入控制台"}
        </Button>
      </form>
    </AuthLayout>
  );
}
