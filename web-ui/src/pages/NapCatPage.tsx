import { useState, useEffect, useCallback, useMemo } from 'react'
import { Button, Spinner, Table } from '@heroui/react'
import { toast } from '@heroui/react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useAppStore } from '../stores/app-store'
import { getNapCatConfig, setNapCatConfig, listNapCatInstances, startNapCat, stopNapCat, discoverNapCat, forgetNapCat, updateSavedNapCat } from '../api/endpoints'
import PageHeader from '../components/shared/PageHeader'
import EmptyState from '../components/shared/EmptyState'
import SimpleModal from '../components/shared/SimpleModal'
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

  // Edit modal
  const [editName, setEditName] = useState<string | null>(null)
  const [editData, setEditData] = useState<{ qqUin: string; webuiPort: string } | null>(null)
  const [editSaving, setEditSaving] = useState(false)

  // Check if current name matches a saved (non-alive) instance for auto-fill hint
  const matchedSaved = useMemo(() => {
    const trimmed = ncName.trim()
    if (!trimmed) return null
    return instances.find(i => i.name === trimmed && i.saved && !i.alive) || null
  }, [ncName, instances])

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
    const name = ncName.trim()
    if (!name) {
      toast.danger('请填写实例名称')
      return
    }
    // If matched a saved instance, start by name only (backend fills qq + port)
    if (matchedSaved) {
      const data = await startNapCat(name)
      if (data !== null) {
        toast.success(`从记忆启动: ${name}`)
        appendLog(`NapCat ${name} 从记忆启动`)
        setNcName(''); setNcQQ(''); setNcWebuiPort('')
        loadPage()
      }
      return
    }
    // Otherwise require QQ
    if (!ncQQ.trim()) {
      toast.danger('请填写 QQ 号（或输入已记忆的实例名称直接启动）')
      return
    }
    const webuiPort = parseInt(ncWebuiPort) || 6099
    const data = await startNapCat(name, ncQQ.trim(), webuiPort)
    if (data !== null) {
      toast.success(`NapCat 实例 ${name} 已启动`)
      appendLog(`NapCat ${name} (QQ:${ncQQ.trim()}) 已启动`)
      setNcName(''); setNcQQ(''); setNcWebuiPort('')
      loadPage()
    }
  }

  const handleStartSaved = async (name: string) => {
    const data = await startNapCat(name)
    if (data !== null) {
      toast.success(`从记忆启动: ${name}`)
      appendLog(`NapCat ${name} 从记忆启动`)
      loadPage()
    }
  }

  const handleRestart = async (name: string) => {
    const stopped = await stopNapCat(name)
    if (stopped !== null) {
      const started = await startNapCat(name)
      if (started !== null) {
        toast.success(`已重新启动: ${name}`)
        appendLog(`NapCat ${name} 已重新启动`)
      }
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

  const handleForget = async (name: string) => {
    const data = await forgetNapCat(name)
    if (data !== null) {
      toast.success(`已删除: ${name}`)
      loadPage()
    }
  }

  const handleForgetAll = async () => {
    const data = await forgetNapCat('all')
    if (data !== null) {
      toast.success('已删除全部实例')
      loadPage()
    }
  }

  const handleShowEdit = (instance: NapCatInstance) => {
    setEditData({ qqUin: instance.qqUin, webuiPort: String(instance.webuiPort || 6099) })
    setEditName(instance.name)
  }

  const handleEditRunning = async (instance: NapCatInstance) => {
    const data = await stopNapCat(instance.name)
    if (data !== null) {
      toast.success(`已停止 ${instance.name}，请编辑后重新启动`)
      await loadPage()
      handleShowEdit(instance)
    }
  }

  const handleEditSave = async () => {
    if (!editName || !editData) return
    setEditSaving(true)
    const webuiPort = parseInt(editData.webuiPort) || 6099
    const data = await updateSavedNapCat(editName, editData.qqUin, webuiPort)
    setEditSaving(false)
    if (data !== null) {
      toast.success(`已更新: ${editName}`)
      appendLog(`NapCat ${editName} 配置已更新`)
      setEditName(null)
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

  // Separate instances into running and saved-only for display
  const runningInstances = useMemo(() => instances.filter(i => i.alive), [instances])
  const savedOnlyInstances = useMemo(() => instances.filter(i => !i.alive && i.saved), [instances])

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
          transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] }}
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

        {/* Instances Table - Running */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.06, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] }}
          className="bg-card-bg backdrop-blur-[var(--glass-blur)] border border-border-theme rounded-2xl p-5"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-text-primary">运行中实例</h3>
            {runningInstances.length > 0 && (
              <Button size="sm" variant="danger-soft" onPress={handleStopAll}>停止全部</Button>
            )}
          </div>
          {runningInstances.length === 0 ? (
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
                  <Table.Column>记忆</Table.Column>
                  <Table.Column>操作</Table.Column>
                </Table.Header>
                <Table.Body>
                  {runningInstances.map(i => (
                    <Table.Row key={i.name} id={i.name}>
                      <Table.Cell>{i.name}</Table.Cell>
                      <Table.Cell>{i.qqUin}</Table.Cell>
                      <Table.Cell>{i.wsPort}</Table.Cell>
                      <Table.Cell>{i.httpPort}</Table.Cell>
                      <Table.Cell>{i.pid}</Table.Cell>
                      <Table.Cell>
                        {i.saved ? (
                          <span className="text-xs text-accent">已记忆</span>
                        ) : (
                          <span className="text-xs text-text-muted">未记忆</span>
                        )}
                      </Table.Cell>
                      <Table.Cell>
                        <div className="flex items-center gap-1.5">
                          <Button size="sm" variant="ghost" onPress={() => navigateToLog(i.name)}>日志</Button>
                          <Button size="sm" variant="outline" onPress={() => handleEditRunning(i)}>编辑</Button>
                          <Button size="sm" variant="primary" onPress={() => handleRestart(i.name)}>启动</Button>
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

        {/* Saved-only Instances (not running) */}
        {savedOnlyInstances.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.09, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] }}
            className="bg-card-bg backdrop-blur-[var(--glass-blur)] border border-border-theme rounded-2xl p-5"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold text-text-primary">记忆实例 <span className="text-sm font-normal text-text-muted">(已停止)</span></h3>
              {savedOnlyInstances.length > 1 && (
                <Button size="sm" variant="danger-soft" onPress={handleForgetAll}>删除全部</Button>
              )}
            </div>
            <Table>
              <Table.Content aria-label="NapCat 记忆实例">
                <Table.Header>
                  <Table.Column isRowHeader>名称</Table.Column>
                  <Table.Column>QQ</Table.Column>
                  <Table.Column>WebUI 端口</Table.Column>
                  <Table.Column>操作</Table.Column>
                </Table.Header>
                <Table.Body>
                  {savedOnlyInstances.map(i => (
                    <Table.Row key={i.name} id={i.name}>
                      <Table.Cell>{i.name}</Table.Cell>
                      <Table.Cell>{i.qqUin}</Table.Cell>
                      <Table.Cell>{i.webuiPort}</Table.Cell>
                      <Table.Cell>
                        <div className="flex items-center gap-1.5">
                          <Button size="sm" variant="primary" onPress={() => handleStartSaved(i.name)}>启动</Button>
                          <Button size="sm" variant="outline" onPress={() => handleShowEdit(i)}>编辑</Button>
                          <Button size="sm" variant="danger-soft" onPress={() => handleForget(i.name)}>删除</Button>
                        </div>
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table.Content>
            </Table>
          </motion.div>
        )}

        {/* Start Form */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.12, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] }}
          className="bg-card-bg backdrop-blur-[var(--glass-blur)] border border-border-theme rounded-2xl p-5"
        >
          <h3 className="text-base font-semibold text-text-primary mb-4">启动新实例</h3>
          {matchedSaved && (
            <div className="mb-3 px-3 py-2 bg-accent/10 border border-accent/30 rounded-xl text-sm text-accent">
              匹配到记忆实例: QQ {matchedSaved.qqUin}, WebUI 端口 {matchedSaved.webuiPort} — 点击启动将直接从记忆恢复
            </div>
          )}
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
              <label className="text-sm text-text-muted mb-1 block">QQ 号 {matchedSaved && <span className="text-accent">(自动填充)</span>}</label>
              <QQHistoryInput
                storageKey="ncQQ"
                placeholder={matchedSaved ? matchedSaved.qqUin : 'QQ 号'}
                value={ncQQ}
                onChange={setNcQQ}
              />
            </div>
            <div>
              <label className="text-sm text-text-muted mb-1 block">WebUI 端口 {matchedSaved && <span className="text-accent">(自动填充)</span>}</label>
              <input
                className="bg-input-bg border border-border-theme text-text-primary rounded-xl px-3 py-2 text-sm outline-none focus:border-accent transition-colors w-full"
                placeholder={matchedSaved ? String(matchedSaved.webuiPort) : '6099'}
                value={ncWebuiPort}
                onChange={e => setNcWebuiPort(e.target.value)}
              />
            </div>
          </div>
          <Button variant="primary" onPress={handleStart}>
            {matchedSaved ? '从记忆启动' : '启动实例'}
          </Button>
        </motion.div>
      </div>

      {/* Edit Modal */}
      <SimpleModal
        isOpen={editName !== null}
        onClose={() => setEditName(null)}
        title={`编辑实例 - ${editName}`}
        footer={
          <>
            <Button size="sm" variant="ghost" onPress={() => setEditName(null)}>取消</Button>
            <Button size="sm" variant="primary" isDisabled={editSaving} onPress={handleEditSave}>保存</Button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="text-sm text-text-muted mb-1 block">实例名称</label>
            <input
              className="bg-input-bg border border-border-theme text-text-muted rounded-xl px-3 py-2 text-sm outline-none w-full cursor-not-allowed"
              value={editName || ''}
              disabled
            />
          </div>
          <div>
            <label className="text-sm text-text-muted mb-1 block">QQ 号</label>
            <input
              className="bg-input-bg border border-border-theme text-text-primary rounded-xl px-3 py-2 text-sm outline-none focus:border-accent transition-colors w-full"
              placeholder="QQ 号"
              value={editData?.qqUin || ''}
              onChange={e => editData && setEditData({ ...editData, qqUin: e.target.value })}
            />
          </div>
          <div>
            <label className="text-sm text-text-muted mb-1 block">WebUI 端口</label>
            <input
              className="bg-input-bg border border-border-theme text-text-primary rounded-xl px-3 py-2 text-sm outline-none focus:border-accent transition-colors w-full"
              placeholder="6099"
              value={editData?.webuiPort || ''}
              onChange={e => editData && setEditData({ ...editData, webuiPort: e.target.value })}
            />
          </div>
        </div>
      </SimpleModal>
    </div>
  )
}
