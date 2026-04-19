import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { useAppStore } from "../stores/app-store";
import { useLocalStorage } from "../hooks/useLocalStorage";
import {
  listBots,
  getFriends,
  getGroups,
  getGroupMembers,
} from "../api/endpoints";
import { PageContainer, PageHeader } from "../components/layout-new";
import { Button, Card, Badge, Spinner } from "../components/ui";
import BotSelect from "../components/shared/BotSelect";
import EmptyState from "../components/shared/EmptyState";
import type { FriendInfo, GroupInfo, GroupMember } from "../api/types";

const EASE = [0.25, 0.1, 0.25, 1] as [number, number, number, number];

export default function ContactsPage() {
  const { setCachedBots } = useAppStore();
  const [bot, setBot] = useState("");
  const [tab, setTab] = useLocalStorage("contactTab", "friends");
  const [loading, setLoading] = useState(false);

  // Friends data
  const [friends, setFriends] = useState<FriendInfo[]>([]);
  // Groups data
  const [groups, setGroups] = useState<GroupInfo[]>([]);
  // Group members
  const [memberGroup, setMemberGroup] = useState<{
    groupId: number;
    groupName: string;
  } | null>(null);
  const [members, setMembers] = useState<GroupMember[]>([]);
  const [membersLoading, setMembersLoading] = useState(false);

  useEffect(() => {
    listBots().then((data) => {
      if (data) setCachedBots(data.bots || [], data.activeBot);
    });
  }, [setCachedBots]);

  const loadContacts = useCallback(async () => {
    if (!bot) {
      setFriends([]);
      setGroups([]);
      return;
    }
    setLoading(true);
    setMemberGroup(null);
    if (tab === "friends") {
      const data = await getFriends(bot);
      setFriends(data || []);
    } else {
      const data = await getGroups(bot);
      setGroups(data || []);
    }
    setLoading(false);
  }, [bot, tab]);

  useEffect(() => {
    loadContacts(); // eslint-disable-line react-hooks/set-state-in-effect
  }, [loadContacts]);

  const handleLoadMembers = async (groupId: number, groupName: string) => {
    setMembersLoading(true);
    const data = await getGroupMembers(bot, groupId);
    setMembers(data || []);
    setMemberGroup({ groupId, groupName });
    setMembersLoading(false);
  };

  const tabBtnClass = (active: boolean) =>
    `relative px-4 py-2 text-sm font-medium transition-colors ${
      active ? "text-text-primary" : "text-text-muted hover:text-text-primary"
    }`;

  const roleBadgeVariant = (role: string) =>
    role === "owner" ? "error" : role === "admin" ? "warning" : "default";

  const roleLabel = (role: string) =>
    role === "owner" ? "群主" : role === "admin" ? "管理员" : "成员";

  return (
    <PageContainer>
      <PageHeader
        title="好友与群"
        description="查看 Bot 的好友和群组"
        actions={
          <BotSelect
            storageKey="select_contactBotSelect"
            connectedOnly
            value={bot}
            onChange={setBot}
          />
        }
      />

      {/* Tabs */}
      <div className="flex border-b border-white/10 mb-4">
        <button
          type="button"
          className={tabBtnClass(tab === "friends")}
          onClick={() => setTab("friends")}
        >
          好友列表
          {tab === "friends" && (
            <span className="absolute left-0 right-0 bottom-[-1px] h-[2px] bg-[#5a7dff] rounded-full" />
          )}
        </button>
        <button
          type="button"
          className={tabBtnClass(tab === "groups")}
          onClick={() => setTab("groups")}
        >
          群列表
          {tab === "groups" && (
            <span className="absolute left-0 right-0 bottom-[-1px] h-[2px] bg-[#5a7dff] rounded-full" />
          )}
        </button>
      </div>

      {/* Friends Panel */}
      {tab === "friends" && (
        <>
          {!bot ? (
            <EmptyState message="请选择 Bot" />
          ) : loading ? (
            <div className="flex justify-center py-12">
              <Spinner size="lg" />
            </div>
          ) : friends.length === 0 ? (
            <EmptyState message="暂无好友" />
          ) : (
            <>
              {/* 手机卡片：< sm */}
              <div className="sm:hidden space-y-2">
                {friends.map((f) => (
                  <Card key={f.userId} variant="glass" padding="md">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="font-medium text-text-primary truncate">
                        {f.nickname}
                      </span>
                      <span className="font-mono text-xs text-neutral-400 flex-shrink-0">
                        {f.userId}
                      </span>
                    </div>
                    {f.remark && (
                      <div className="text-xs text-neutral-400 truncate">
                        备注: {f.remark}
                      </div>
                    )}
                  </Card>
                ))}
              </div>

              {/* 桌面表格：≥ sm */}
              <Card
                variant="glass"
                padding="none"
                className="overflow-hidden hidden sm:block"
              >
                <table className="w-full text-sm">
                  <thead className="bg-white/[0.03] border-b border-white/10">
                    <tr className="text-left text-xs text-neutral-400 uppercase tracking-wider">
                      <th className="px-4 py-3">QQ</th>
                      <th className="px-4 py-3">昵称</th>
                      <th className="px-4 py-3">备注</th>
                    </tr>
                  </thead>
                  <tbody>
                    {friends.map((f) => (
                      <tr
                        key={f.userId}
                        className="border-b border-white/5 hover:bg-white/[0.02] transition-colors"
                      >
                        <td className="px-4 py-3 text-text-primary">
                          {f.userId}
                        </td>
                        <td className="px-4 py-3 text-text-primary">
                          {f.nickname}
                        </td>
                        <td className="px-4 py-3 text-text-primary">
                          {f.remark || ""}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Card>
            </>
          )}
        </>
      )}

      {/* Groups Panel */}
      {tab === "groups" && (
        <>
          {!bot ? (
            <EmptyState message="请选择 Bot" />
          ) : loading ? (
            <div className="flex justify-center py-12">
              <Spinner size="lg" />
            </div>
          ) : groups.length === 0 ? (
            <EmptyState message="暂无群组" />
          ) : (
            <>
              {/* 手机卡片：< sm */}
              <div className="sm:hidden space-y-2">
                {groups.map((g) => (
                  <Card key={g.groupId} variant="glass" padding="md">
                    <div className="mb-2">
                      <div className="font-medium text-text-primary truncate">
                        {g.groupName}
                      </div>
                      <div className="font-mono text-xs text-neutral-400">
                        {g.groupId} · {g.memberCount}/{g.maxMemberCount}
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="w-full"
                      onClick={() => handleLoadMembers(g.groupId, g.groupName)}
                    >
                      查看成员
                    </Button>
                  </Card>
                ))}
              </div>

              {/* 桌面表格：≥ sm */}
              <Card
                variant="glass"
                padding="none"
                className="overflow-hidden hidden sm:block"
              >
                <table className="w-full text-sm">
                  <thead className="bg-white/[0.03] border-b border-white/10">
                    <tr className="text-left text-xs text-neutral-400 uppercase tracking-wider">
                      <th className="px-4 py-3">群号</th>
                      <th className="px-4 py-3">群名</th>
                      <th className="px-4 py-3">成员数</th>
                      <th className="px-4 py-3">操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    {groups.map((g) => (
                      <tr
                        key={g.groupId}
                        className="border-b border-white/5 hover:bg-white/[0.02] transition-colors"
                      >
                        <td className="px-4 py-3 text-text-primary">
                          {g.groupId}
                        </td>
                        <td className="px-4 py-3 text-text-primary">
                          {g.groupName}
                        </td>
                        <td className="px-4 py-3 text-text-primary">
                          {g.memberCount}/{g.maxMemberCount}
                        </td>
                        <td className="px-4 py-3">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() =>
                              handleLoadMembers(g.groupId, g.groupName)
                            }
                          >
                            查看成员
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Card>

              {/* Members Section */}
              {memberGroup && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, ease: EASE }}
                  className="mt-6"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-base font-semibold text-text-primary">
                      群成员 - {memberGroup.groupName} ({memberGroup.groupId})
                    </h3>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setMemberGroup(null)}
                    >
                      关闭
                    </Button>
                  </div>
                  {membersLoading ? (
                    <div className="flex justify-center py-8">
                      <Spinner size="md" />
                    </div>
                  ) : members.length === 0 ? (
                    <EmptyState message="暂无成员" />
                  ) : (
                    <>
                      {/* 手机卡片：< sm */}
                      <div className="sm:hidden space-y-2">
                        {members.map((m) => (
                          <Card key={m.userId} variant="glass" padding="md">
                            <div className="flex items-center justify-between gap-2 mb-1">
                              <span className="font-medium text-text-primary truncate">
                                {m.card || m.nickname}
                              </span>
                              <Badge
                                size="sm"
                                variant={roleBadgeVariant(m.role)}
                                className="flex-shrink-0"
                              >
                                {roleLabel(m.role)}
                              </Badge>
                            </div>
                            <div className="font-mono text-xs text-neutral-400">
                              {m.userId}
                            </div>
                            {m.card && m.card !== m.nickname && (
                              <div className="text-xs text-neutral-400 truncate">
                                昵称: {m.nickname}
                              </div>
                            )}
                          </Card>
                        ))}
                      </div>

                      {/* 桌面表格：≥ sm */}
                      <Card
                        variant="glass"
                        padding="none"
                        className="overflow-hidden hidden sm:block"
                      >
                        <table className="w-full text-sm">
                          <thead className="bg-white/[0.03] border-b border-white/10">
                            <tr className="text-left text-xs text-neutral-400 uppercase tracking-wider">
                              <th className="px-4 py-3">QQ</th>
                              <th className="px-4 py-3">昵称</th>
                              <th className="px-4 py-3">群名片</th>
                              <th className="px-4 py-3">角色</th>
                            </tr>
                          </thead>
                          <tbody>
                            {members.map((m) => (
                              <tr
                                key={m.userId}
                                className="border-b border-white/5 hover:bg-white/[0.02] transition-colors"
                              >
                                <td className="px-4 py-3 text-text-primary">
                                  {m.userId}
                                </td>
                                <td className="px-4 py-3 text-text-primary">
                                  {m.nickname}
                                </td>
                                <td className="px-4 py-3 text-text-primary">
                                  {m.card || ""}
                                </td>
                                <td className="px-4 py-3">
                                  <Badge
                                    size="sm"
                                    variant={roleBadgeVariant(m.role)}
                                  >
                                    {roleLabel(m.role)}
                                  </Badge>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </Card>
                    </>
                  )}
                </motion.div>
              )}
            </>
          )}
        </>
      )}
    </PageContainer>
  );
}
