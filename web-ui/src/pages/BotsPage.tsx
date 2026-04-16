import { useState, useEffect, useCallback } from 'react'
import { Button, Chip, Spinner, Table, RadioGroup, Radio } from '@heroui/react'
import { toast } from '@heroui/react'
import { motion } from 'framer-motion'
import { useAppStore } from '../stores/app-store'
import { listBots, addBot, deleteBot, connectBot, disconnectBot, getBotConfig, updateBotConfig } from '../api/endpoints'
import PageHeader from '../components/shared/PageHeader'
import EmptyState from '../components/shared/EmptyState'
import ConfirmModal from '../components/shared/ConfirmModal'
import SimpleModal from '../components/shared/SimpleModal'
import type { BotConfig } from '../api/types'

export default function BotsPage() {
  const { cachedBots, activeBotName, setCachedBots, appendLog } = useAppStore()
  const [loading, setLoading] = useState(true)
  const [addName, setAddName] = useState('')

  // Delete confirm
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null)

  // Config modal
  const [configBot, setConfigBot] = useState<string | null>(null)
  const [configData, setConfigData] = useState<BotConfig | null>(null)
  const [configSaving, setConfigSaving] = useState(false)

  const loadBots = useCallback(async () => {
    const data = await listBots()
    if (data) {
      setCachedBots(data.bots || [], data.activeBot)
    }
    setLoading(false)
  }, [setCachedBots])

  useEffect(() => {
    loadBots()
  }, [loadBots])

  const handleAdd = async () => {
    const name = addName.trim()
    if (!name) {
      toast.danger('请输入 Bot 名称')
      return
    }
    const data = await addBot(name)
    if (data !== null) {
      setAddName('')
      toast.success(`Bot "${name}" 已添加`)
      appendLog(`添加 Bot: ${name}`)
      loadBots()
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    const data = await deleteBot(deleteTarget)
    if (data !== null) {
      toast.success('已删除')
      appendLog(`删除 Bot: ${deleteTarget}`)
      loadBots()
    }
  }

  const handleToggle = async (name: string, connect: boolean) => {
    const data = connect ? await connectBot(name) : await disconnectBot(name)
    if (data !== null) {
      toast.success(`${name} ${connect ? '已连接' : '已断开'}`)
      appendLog(`${name} ${connect ? '连接成功' : '已断开'}`)
      loadBots()
    }
  }

  const handleShowConfig = async (name: string) => {
    const cfg = await getBotConfig(name)
    if (cfg) {
      setConfigData({ ...cfg })
      setConfigBot(name)
    }
  }

  const handleSaveConfig = async () => {
    if (!configBot || !configData) return
    setConfigSaving(true)
    const data = await updateBotConfig(configBot, {
      mode: configData.mode,
      wsUrl: configData.wsUrl,
      httpUrl: configData.httpUrl,
      wsToken: configData.wsToken,
      httpToken: configData.httpToken,
    })
    setConfigSaving(false)
    if (data !== null) {
      toast.success('配置已保存')
      appendLog(`更新配置: ${configBot}`)
      setConfigBot(null)
      loadBots()
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Spinner size="lg" color="accent" />
      </div>
    )
  }

  return (
    <div>
      <PageHeader title="Bot 管理">
        <div className="flex items-center gap-2">
          <input
            className="bg-input-bg border border-border-theme text-text-primary rounded-xl px-3 py-2 text-sm outline-none focus:border-accent transition-colors"
            placeholder="Bot 名称"
            value={addName}
            onChange={e => setAddName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleAdd()}
          />
          <Button size="sm" variant="primary" onPress={handleAdd}>添加</Button>
        </div>
      </PageHeader>

      {cachedBots.length === 0 ? (
        <EmptyState message="暂无 Bot" />
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
        >
        <Table>
          <Table.Content aria-label="Bot 列表">
            <Table.Header>
              <Table.Column isRowHeader>名称</Table.Column>
              <Table.Column>模式</Table.Column>
              <Table.Column>地址</Table.Column>
              <Table.Column>状态</Table.Column>
              <Table.Column>操作</Table.Column>
            </Table.Header>
            <Table.Body>
              {cachedBots.map(bot => (
                <Table.Row key={bot.name} id={bot.name}>
                  <Table.Cell>
                    <span className="text-text-primary font-medium">{bot.name}</span>
                    {bot.name === activeBotName && (
                      <Chip size="sm" color="success" variant="soft" className="ml-2">当前</Chip>
                    )}
                  </Table.Cell>
                  <Table.Cell>
                    <Chip
                      size="sm"
                      variant="soft"
                      color={bot.mode === 'ws' ? 'accent' : 'warning'}
                    >
                      {bot.mode.toUpperCase()}
                    </Chip>
                  </Table.Cell>
                  <Table.Cell>
                    <span className="text-text-secondary max-w-[250px] truncate inline-block">
                      {bot.mode === 'ws' ? bot.wsUrl : bot.httpUrl}
                    </span>
                  </Table.Cell>
                  <Table.Cell>
                    <Chip
                      size="sm"
                      variant="soft"
                      color={bot.connected ? 'success' : 'default'}
                    >
                      {bot.connected ? '在线' : '离线'}
                    </Chip>
                  </Table.Cell>
                  <Table.Cell>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <Button size="sm" variant="outline" onPress={() => handleShowConfig(bot.name)}>配置</Button>
                      {bot.connected ? (
                        <Button size="sm" variant="danger-soft" onPress={() => handleToggle(bot.name, false)}>断开</Button>
                      ) : (
                        <Button size="sm" variant="ghost" className="text-success" onPress={() => handleToggle(bot.name, true)}>连接</Button>
                      )}
                      <Button size="sm" variant="danger-soft" onPress={() => setDeleteTarget(bot.name)}>删除</Button>
                    </div>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Content>
        </Table>
        </motion.div>
      )}

      {/* Delete Confirm Modal */}
      <ConfirmModal
        isOpen={deleteTarget !== null}
        title="确认删除"
        message={`确定要删除 Bot "${deleteTarget}" 吗？`}
        onConfirm={handleDelete}
        onClose={() => setDeleteTarget(null)}
      />

      {/* Config Modal */}
      <SimpleModal
        isOpen={configBot !== null}
        onClose={() => setConfigBot(null)}
        title={`配置 - ${configBot}`}
        footer={
          <>
            <Button size="sm" variant="ghost" onPress={() => setConfigBot(null)}>取消</Button>
            <Button size="sm" variant="primary" isDisabled={configSaving} onPress={handleSaveConfig}>保存</Button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="text-sm text-text-muted mb-1 block">连接模式</label>
            <RadioGroup
              orientation="horizontal"
              value={configData?.mode ?? 'ws'}
              onChange={(value) => configData && setConfigData({ ...configData, mode: value as 'ws' | 'http' })}
            >
              <Radio value="ws">WebSocket</Radio>
              <Radio value="http">HTTP</Radio>
            </RadioGroup>
          </div>
          <div>
            <label className="text-sm text-text-muted mb-1 block">WS 地址</label>
            <input
              className="bg-input-bg border border-border-theme text-text-primary rounded-xl px-3 py-2 text-sm outline-none focus:border-accent transition-colors w-full"
              value={configData?.wsUrl || ''}
              onChange={e => configData && setConfigData({ ...configData, wsUrl: e.target.value })}
            />
          </div>
          <div>
            <label className="text-sm text-text-muted mb-1 block">HTTP 地址</label>
            <input
              className="bg-input-bg border border-border-theme text-text-primary rounded-xl px-3 py-2 text-sm outline-none focus:border-accent transition-colors w-full"
              value={configData?.httpUrl || ''}
              onChange={e => configData && setConfigData({ ...configData, httpUrl: e.target.value })}
            />
          </div>
          <div>
            <label className="text-sm text-text-muted mb-1 block">WS Token</label>
            <input
              className="bg-input-bg border border-border-theme text-text-primary rounded-xl px-3 py-2 text-sm outline-none focus:border-accent transition-colors w-full"
              type="password"
              value={configData?.wsToken || ''}
              onChange={e => configData && setConfigData({ ...configData, wsToken: e.target.value })}
            />
          </div>
          <div>
            <label className="text-sm text-text-muted mb-1 block">HTTP Token</label>
            <input
              className="bg-input-bg border border-border-theme text-text-primary rounded-xl px-3 py-2 text-sm outline-none focus:border-accent transition-colors w-full"
              type="password"
              value={configData?.httpToken || ''}
              onChange={e => configData && setConfigData({ ...configData, httpToken: e.target.value })}
            />
          </div>
        </div>
      </SimpleModal>
    </div>
  )
}
