import { useState, useEffect, useCallback } from 'react'
import { Button, Switch, Spinner, Table } from '@heroui/react'
import { toast } from '@heroui/react'
import { motion } from 'framer-motion'
import { useAppStore } from '../stores/app-store'
import { listBots, listSchedules, addSchedule, deleteSchedule, toggleSchedule, testSchedule } from '../api/endpoints'
import PageHeader from '../components/shared/PageHeader'
import BotSelect from '../components/shared/BotSelect'
import EmptyState from '../components/shared/EmptyState'
import type { ScheduleTask } from '../api/types'

export default function SchedulesPage() {
  const { setCachedBots, appendLog } = useAppStore()
  const [bot, setBot] = useState('')
  const [schedules, setSchedules] = useState<ScheduleTask[]>([])
  const [loading, setLoading] = useState(false)

  // Add form
  const [name, setName] = useState('')
  const [time, setTime] = useState('')
  const [targets, setTargets] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    listBots().then(data => {
      if (data) setCachedBots(data.bots || [], data.activeBot)
    })
  }, [setCachedBots])

  const loadScheduleList = useCallback(async () => {
    if (!bot) {
      setSchedules([])
      return
    }
    setLoading(true)
    const data = await listSchedules(bot)
    setSchedules(data || [])
    setLoading(false)
  }, [bot])

  useEffect(() => {
    loadScheduleList()
  }, [loadScheduleList])

  const handleAdd = async () => {
    if (!bot) { toast.danger('请选择 Bot'); return }
    if (!name.trim() || !time || !targets.trim() || !message.trim()) {
      toast.danger('请填写所有字段')
      return
    }
    const targetNums = targets.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n))
    if (targetNums.length === 0) {
      toast.danger('目标格式错误')
      return
    }
    const data = await addSchedule(bot, { name: name.trim(), time, targets: targetNums, message: message.trim() })
    if (data !== null) {
      toast.success('任务已添加')
      appendLog(`添加定时任务: ${name.trim()}`)
      setName(''); setTime(''); setTargets(''); setMessage('')
      loadScheduleList()
    }
  }

  const handleToggle = async (taskName: string, enabled: boolean) => {
    await toggleSchedule(bot, taskName, enabled)
  }

  const handleTest = async (taskName: string) => {
    const data = await testSchedule(bot, taskName)
    if (data !== null) {
      toast.success('已触发测试')
      appendLog(`测试定时任务: ${taskName}`)
    }
  }

  const handleDelete = async (taskName: string) => {
    const data = await deleteSchedule(bot, taskName)
    if (data !== null) {
      toast.success('已删除')
      appendLog(`删除定时任务: ${taskName}`)
      loadScheduleList()
    }
  }

  return (
    <div>
      <PageHeader title="定时任务">
        <BotSelect storageKey="select_scheduleBotSelect" value={bot} onChange={setBot} />
      </PageHeader>

      {!bot ? (
        <EmptyState message="请选择 Bot" />
      ) : loading ? (
        <div className="flex justify-center py-12">
          <Spinner size="lg" color="accent" />
        </div>
      ) : (
        <>
          {/* Schedule Table */}
          {schedules.length === 0 ? (
            <EmptyState message="暂无定时任务" />
          ) : (
            <div className="mb-6">
              <Table>
                <Table.Content aria-label="定时任务列表">
                  <Table.Header>
                    <Table.Column isRowHeader>任务名</Table.Column>
                    <Table.Column>时间</Table.Column>
                    <Table.Column>目标</Table.Column>
                    <Table.Column>消息</Table.Column>
                    <Table.Column>启用</Table.Column>
                    <Table.Column>操作</Table.Column>
                  </Table.Header>
                  <Table.Body>
                    {schedules.map(t => (
                      <Table.Row key={t.name} id={t.name}>
                        <Table.Cell>{t.name}</Table.Cell>
                        <Table.Cell>{t.time}</Table.Cell>
                        <Table.Cell>{(t.targets || []).join(', ')}</Table.Cell>
                        <Table.Cell>
                          <span className="max-w-[200px] truncate inline-block">{t.message}</span>
                        </Table.Cell>
                        <Table.Cell>
                          <Switch
                            size="sm"
                            defaultSelected={t.enabled}
                            onChange={(isSelected: boolean) => handleToggle(t.name, isSelected)}
                          />
                        </Table.Cell>
                        <Table.Cell>
                          <div className="flex items-center gap-1.5">
                            <Button size="sm" variant="ghost" className="text-warning" onPress={() => handleTest(t.name)}>测试</Button>
                            <Button size="sm" variant="danger-soft" onPress={() => handleDelete(t.name)}>删除</Button>
                          </div>
                        </Table.Cell>
                      </Table.Row>
                    ))}
                  </Table.Body>
                </Table.Content>
              </Table>
            </div>
          )}

          {/* Add Form */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
            className="bg-card-bg backdrop-blur-[var(--glass-blur)] border border-border-theme rounded-2xl p-5"
          >
            <h3 className="text-base font-semibold text-text-primary mb-4">添加定时任务</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="text-sm text-text-muted mb-1 block">任务名称</label>
                <input
                  className="bg-input-bg border border-border-theme text-text-primary rounded-xl px-3 py-2 text-sm outline-none focus:border-accent transition-colors w-full"
                  placeholder="任务名称"
                  value={name}
                  onChange={e => setName(e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm text-text-muted mb-1 block">执行时间 (HH:mm)</label>
                <input
                  className="bg-input-bg border border-border-theme text-text-primary rounded-xl px-3 py-2 text-sm outline-none focus:border-accent transition-colors w-full"
                  type="time"
                  value={time}
                  onChange={e => setTime(e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm text-text-muted mb-1 block">目标 (逗号分隔群号/QQ号)</label>
                <input
                  className="bg-input-bg border border-border-theme text-text-primary rounded-xl px-3 py-2 text-sm outline-none focus:border-accent transition-colors w-full"
                  placeholder="123456,789012"
                  value={targets}
                  onChange={e => setTargets(e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm text-text-muted mb-1 block">消息内容</label>
                <input
                  className="bg-input-bg border border-border-theme text-text-primary rounded-xl px-3 py-2 text-sm outline-none focus:border-accent transition-colors w-full"
                  placeholder="消息内容"
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                />
              </div>
            </div>
            <Button variant="primary" onPress={handleAdd}>添加任务</Button>
          </motion.div>
        </>
      )}
    </div>
  )
}
