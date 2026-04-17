import { useState, useEffect, useCallback } from "react";
import { Button, Chip, Spinner, Tabs, Table } from "@heroui/react";
import { motion } from "framer-motion";
import { useAppStore } from "../stores/app-store";
import { useLocalStorage } from "../hooks/useLocalStorage";
import {
  listBots,
  getFriends,
  getGroups,
  getGroupMembers,
} from "../api/endpoints";
import PageHeader from "../components/shared/PageHeader";
import BotSelect from "../components/shared/BotSelect";
import EmptyState from "../components/shared/EmptyState";
import type { FriendInfo, GroupInfo, GroupMember } from "../api/types";

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

  return (
    <div>
      <PageHeader title="好友与群">
        <BotSelect
          storageKey="select_contactBotSelect"
          connectedOnly
          value={bot}
          onChange={setBot}
        />
      </PageHeader>

      <Tabs
        selectedKey={tab}
        onSelectionChange={(key) => setTab(key as string)}
      >
        <Tabs.List>
          <Tabs.Tab id="friends">
            好友列表
            <Tabs.Indicator />
          </Tabs.Tab>
          <Tabs.Tab id="groups">
            群列表
            <Tabs.Indicator />
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel id="friends">
          {!bot ? (
            <EmptyState message="请选择 Bot" />
          ) : loading ? (
            <div className="flex justify-center py-12">
              <Spinner size="lg" color="accent" />
            </div>
          ) : friends.length === 0 ? (
            <EmptyState message="暂无好友" />
          ) : (
            <Table>
              <Table.Content aria-label="好友列表">
                <Table.Header>
                  <Table.Column isRowHeader>QQ</Table.Column>
                  <Table.Column>昵称</Table.Column>
                  <Table.Column>备注</Table.Column>
                </Table.Header>
                <Table.Body>
                  {friends.map((f) => (
                    <Table.Row key={f.userId} id={f.userId}>
                      <Table.Cell>{f.userId}</Table.Cell>
                      <Table.Cell>{f.nickname}</Table.Cell>
                      <Table.Cell>{f.remark || ""}</Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table.Content>
            </Table>
          )}
        </Tabs.Panel>

        <Tabs.Panel id="groups">
          {!bot ? (
            <EmptyState message="请选择 Bot" />
          ) : loading ? (
            <div className="flex justify-center py-12">
              <Spinner size="lg" color="accent" />
            </div>
          ) : groups.length === 0 ? (
            <EmptyState message="暂无群组" />
          ) : (
            <>
              <Table>
                <Table.Content aria-label="群列表">
                  <Table.Header>
                    <Table.Column isRowHeader>群号</Table.Column>
                    <Table.Column>群名</Table.Column>
                    <Table.Column>成员数</Table.Column>
                    <Table.Column>操作</Table.Column>
                  </Table.Header>
                  <Table.Body>
                    {groups.map((g) => (
                      <Table.Row key={g.groupId} id={g.groupId}>
                        <Table.Cell>{g.groupId}</Table.Cell>
                        <Table.Cell>{g.groupName}</Table.Cell>
                        <Table.Cell>
                          {g.memberCount}/{g.maxMemberCount}
                        </Table.Cell>
                        <Table.Cell>
                          <Button
                            size="sm"
                            variant="ghost"
                            onPress={() =>
                              handleLoadMembers(g.groupId, g.groupName)
                            }
                          >
                            查看成员
                          </Button>
                        </Table.Cell>
                      </Table.Row>
                    ))}
                  </Table.Body>
                </Table.Content>
              </Table>

              {/* Members Section */}
              {memberGroup && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
                  className="mt-6"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-base font-semibold text-text-primary">
                      群成员 - {memberGroup.groupName} ({memberGroup.groupId})
                    </h3>
                    <Button
                      size="sm"
                      variant="ghost"
                      onPress={() => setMemberGroup(null)}
                    >
                      关闭
                    </Button>
                  </div>
                  {membersLoading ? (
                    <div className="flex justify-center py-8">
                      <Spinner size="md" color="accent" />
                    </div>
                  ) : members.length === 0 ? (
                    <EmptyState message="暂无成员" />
                  ) : (
                    <Table>
                      <Table.Content aria-label="群成员列表">
                        <Table.Header>
                          <Table.Column isRowHeader>QQ</Table.Column>
                          <Table.Column>昵称</Table.Column>
                          <Table.Column>群名片</Table.Column>
                          <Table.Column>角色</Table.Column>
                        </Table.Header>
                        <Table.Body>
                          {members.map((m) => (
                            <Table.Row key={m.userId} id={m.userId}>
                              <Table.Cell>{m.userId}</Table.Cell>
                              <Table.Cell>{m.nickname}</Table.Cell>
                              <Table.Cell>{m.card || ""}</Table.Cell>
                              <Table.Cell>
                                <Chip
                                  size="sm"
                                  variant="soft"
                                  color={
                                    m.role === "owner"
                                      ? "danger"
                                      : m.role === "admin"
                                        ? "warning"
                                        : "default"
                                  }
                                >
                                  {m.role === "owner"
                                    ? "群主"
                                    : m.role === "admin"
                                      ? "管理员"
                                      : "成员"}
                                </Chip>
                              </Table.Cell>
                            </Table.Row>
                          ))}
                        </Table.Body>
                      </Table.Content>
                    </Table>
                  )}
                </motion.div>
              )}
            </>
          )}
        </Tabs.Panel>
      </Tabs>
    </div>
  );
}
