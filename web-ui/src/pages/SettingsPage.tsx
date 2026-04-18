import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Input } from "../components/ui";
import { toast } from "@heroui/react";
import { apiCall, clearAdminToken } from "../api/client";

interface ChangeResp {
  changed: boolean;
}

export default function SettingsPage() {
  const navigate = useNavigate();
  const [oldPwd, setOldPwd] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (newPwd.length < 6) {
      toast.danger("新密码至少 6 位");
      return;
    }
    if (newPwd !== confirmPwd) {
      toast.danger("两次输入的新密码不一致");
      return;
    }
    setLoading(true);
    const data = await apiCall<ChangeResp>(
      "POST",
      "/api/auth/change-password",
      {
        oldPassword: oldPwd,
        newPassword: newPwd,
      },
    );
    setLoading(false);
    if (data?.changed) {
      toast.success("密码已修改，请重新登录");
      clearAdminToken();
      navigate("/login", { replace: true });
    }
  }

  return (
    <div className="p-6 max-w-xl mx-auto">
      <div className="rounded-xl p-6 bg-[rgba(15,20,25,0.72)] backdrop-blur-[20px] border border-[var(--glass-border)] space-y-5">
        <div>
          <h1 className="text-lg font-semibold text-[var(--color-text-primary)]">
            修改管理员密码
          </h1>
          <p className="text-xs text-[var(--color-text-muted)] mt-1">
            修改成功后会立即吊销当前登录，需用新密码重新登录。
          </p>
        </div>
        <form onSubmit={onSubmit} className="space-y-4">
          <Input
            label="当前密码"
            type="password"
            placeholder="请输入当前密码"
            value={oldPwd}
            onChange={(e) => setOldPwd(e.target.value)}
            autoFocus
            fullWidth
          />
          <Input
            label="新密码"
            type="password"
            placeholder="至少 6 位"
            value={newPwd}
            onChange={(e) => setNewPwd(e.target.value)}
            fullWidth
          />
          <Input
            label="确认新密码"
            type="password"
            placeholder="再次输入新密码"
            value={confirmPwd}
            onChange={(e) => setConfirmPwd(e.target.value)}
            fullWidth
          />
          <Button
            type="submit"
            variant="primary"
            disabled={loading || !oldPwd || !newPwd || !confirmPwd}
          >
            {loading ? "提交中…" : "修改密码"}
          </Button>
        </form>
      </div>
    </div>
  );
}
