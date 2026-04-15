import { useState, useEffect, useCallback } from 'react'
import { Button, Spinner, Table } from '@heroui/react'
import { toast } from '@heroui/react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useAppStore } from '../stores/app-store'
import { getNapCatConfig, setNapCatConfig, listNapCatInstances, startNapCat, stopNapCat, discoverNapCat } from '../api/endpoints'
import PageHeader from '../components/shared/PageHeader'
import EmptyState from '../components/shared/EmptyState'
import QQHistoryInput from '../components/shared/QQHistoryInput'
import type { NapCatConfig, NapCatInstance } from '../api/types'

export default function NapCatPage() {
  const navigate = useNavigate()
  const { appendLog } = useAppStore()
  const [config, setConfig] = useState<NapCatConfig>({ napCatDir: '', workRoot: '' })
  const [instances, setInstances] = useState<NapCatInstance[]>([])
  const [loading, setLoading] = useState(true)

  // Start form
  const [ncName, setNcName] = useState('')
  const [ncQQ, setNcQQ] = useState('')
  const [ncWebuiPort, setNcWebuiPort] = useState('')

  const loadPage = useCallback(async () => {
    const [cfg, inst] = await Promise.all([
      getNapCatConfig(),
      listNapCatInstances()
    ])
    if (cfg) setConfig(cfg)
    setInstances(inst || [])
    setLoading(false)
  }, [])

  useEffect(() => {
    loadPage()
  }, [loadPage])

  const handleSaveConfig = async () => {
    const data = await setNapCatConfig(config)
    if (data !== null) {
      toast.success('NapCat 配置已保存')
    }
  }

  const handleStart = async () => {
    if (!ncName.trim() || !ncQQ.trim()) {
      toast.danger('请填写名称和 QQ 号')
      return
    }
    const webuiPort = parseInt(ncWebuiPort) || 6099
    const data = await startNapCat(ncName.trim(), ncQQ.trim(), webuiPort)
    if (data !== null) {
      toast.success(`NapCat 实例 ${ncName.trim()} 已启动`)
      appendLog(`NapCat ${ncName.trim()} (QQ:${ncQQ.trim()}) 已启动`)
      setNcName(''); setNcQQ(''); setNcWebuiPort('')
      loadPage()
    }
  }

  const handleStop = async (name: string) => {
    const data = await stopNapCat(name)
    if (data !== null) {
      toast.success(`已停止 ${name}`)
      loadPage()
    }
  }

  const handleStopAll = async () => {
    const data = await stopNapCat('all')
    if (data !== null) {
      toast.success('已停止所有实例')
      loadPage()
    }
  }

  const handleDiscover = async () => {
    const data = await discoverNapCat()
    if (data !== null) {
      toast.success(`发现完成: 新建 ${data.created || 0} 个，共 ${data.total || 0} 个 Bot`)
      appendLog(`NapCat 自动发现: 新建 ${data.created || 0} 个`)
    }
  }

  const navigateToLog = (name: string) => {
    navigate(`/nc-logs?instance=${encodeURIComponent(name)}`)
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
      <PageHeader title="NapCat 管理">
        <Button size="sm" variant="outline" onPress={handleDiscover}>自动发现</Button>
      </PageHeader>

      <div className="space-y-6">
        {/* Config Section */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
          className="bg-card-bg backdrop-blur-[var(--glass-blur)] border border-border-theme rounded-2xl p-5"
        >
          <h3 className="text-base font-semibold text-text-primary mb-4">NapCat 配置</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-sm text-text-muted mb-1 block">NapCat 目录</label>
              <input
                className="bg-input-bg border border-border-theme text-text-primary rounded-xl px-3 py-2 text-sm outline-none focus:border-accent transition-colors w-full"
                placeholder="NapCat 安装目录"
                value={config.napCatDir}
                onChange={e => setConfig({ ...config, napCatDir: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm text-text-muted mb-1 block">工作目录</label>
              <input
                className="bg-input-bg border border-border-theme text-text-primary rounded-xl px-3 py-2 text-sm outline-none focus:border-accent transition-colors w-full"
                placeholder="工作目录根路径"
                value={config.workRoot}
                onChange={e => setConfig({ ...config, workRoot: e.target.value })}
              />
            </div>
          </div>
          <Button size="sm" variant="primary" onPress={handleSaveConfig}>保存配置</Button>
        </motion.div>

        {/* Instances Table */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.06, ease: [0.25, 0.1, 0.25, 1] }}
          className="bg-card-bg backdrop-blur-[var(--glass-blur)] border border-border-theme rounded-2xl p-5"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-text-primary">运行实例</h3>
            {instances.length > 0 && (
              <Button size="sm" variant="danger-soft" onPress={handleStopAll}>停止全部</Button>
            )}
          </div>
          {instances.length === 0 ? (
            <EmptyState message="暂无运行中的实例" />
          ) : (
            <Table>
              <Table.Content aria-label="NapCat 运行实例">
                <Table.Header>
                  <Table.Column isRowHeader>名称</Table.Column>
                  <Table.Column>QQ</Table.Column>
                  <Table.Column>WS 端口</Table.Column>
                  <Table.Column>HTTP 端口</Table.Column>
                  <Table.Column>PID</Table.Column>
                  <Table.Column>操作</Table.Column>
                </Table.Header>
                <Table.Body>
                  {instances.map(i => (
                    <Table.Row key={i.name} id={i.name}>
                      <Table.Cell>{i.name}</Table.Cell>
                      <Table.Cell>{i.qqUin}</Table.Cell>
                      <Table.Cell>{i.wsPort}</Table.Cell>
                      <Table.Cell>{i.httpPort}</Table.Cell>
                      <Table.Cell>{i.pid}</Table.Cell>
                      <Table.Cell>
                        <div className="flex items-center gap-1.5">
                          <Button size="sm" variant="ghost" onPress={() => navigateToLog(i.name)}>日志</Button>
                          <Button size="sm" variant="danger-soft" onPress={() => handleStop(i.name)}>停止</Button>
                        </div>
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table.Content>
            </Table>
          )}
        </motion.div>

        {/* Start Form */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.12, ease: [0.25, 0.1, 0.25, 1] }}
          className="bg-card-bg backdrop-blur-[var(--glass-blur)] border border-border-theme rounded-2xl p-5"
        >
          <h3 className="text-base font-semibold text-text-primary mb-4">启动新实例</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="text-sm text-text-muted mb-1 block">实例名称</label>
              <input
                className="bg-input-bg border border-border-theme text-text-primary rounded-xl px-3 py-2 text-sm outline-none focus:border-accent transition-colors w-full"
                placeholder="实例名称"
                value={ncName}
                onChange={e => setNcName(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm text-text-muted mb-1 block">QQ 号</label>
              <QQHistoryInput
                storageKey="ncQQ"
                placeholder="QQ 号"
                value={ncQQ}
                onChange={setNcQQ}
              />
            </div>
            <div>
              <label className="text-sm text-text-muted mb-1 block">WebUI 端口</label>
              <input
                className="bg-input-bg border border-border-theme text-text-primary rounded-xl px-3 py-2 text-sm outline-none focus:border-accent transition-colors w-full"
                placeholder="6099"
                value={ncWebuiPort}
                onChange={e => setNcWebuiPort(e.target.value)}
              />
            </div>
          </div>
          <Button variant="primary" onPress={handleStart}>启动实例</Button>
        </motion.div>
      </div>
    </div>
  )
}
