import { useState, useEffect, useCallback } from 'react'
import { Button, Spinner, Select, ListBox, Switch } from '@heroui/react'
import { useInterval } from '../hooks/useInterval'
import { listLogFiles, readLog } from '../api/endpoints'
import PageHeader from '../components/shared/PageHeader'
import LogViewer from '../components/shared/LogViewer'
import type { LogFileInfo } from '../api/types'
import type { Key } from 'react-aria-components'

export default function ServerLogsPage() {
  const [files, setFiles] = useState<LogFileInfo[]>([])
  const [selectedFile, setSelectedFile] = useState('latest.log')
  const [lineCount, setLineCount] = useState('200')
  const [lines, setLines] = useState<string[]>([])
  const [info, setInfo] = useState('')
  const [autoRefresh, setAutoRefresh] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    listLogFiles().then(data => {
      setFiles(data || [])
      setLoading(false)
    })
  }, [])

  const loadLog = useCallback(async () => {
    const numLines = parseInt(lineCount) || 200
    const data = await readLog(selectedFile, numLines)
    if (data && data.lines) {
      setLines(data.lines)
      setInfo(`${data.file} - 显示第 ${data.from + 1} ~ ${data.from + data.lines.length} 行 (共 ${data.total} 行)`)
    }
  }, [selectedFile, lineCount])

  useEffect(() => {
    loadLog()
  }, [loadLog])

  // Auto-refresh every 3s
  useInterval(loadLog, autoRefresh ? 3000 : null)

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Spinner size="lg" color="accent" />
      </div>
    )
  }

  return (
    <div>
      <PageHeader title="服务端日志">
        <div className="flex items-center gap-3 flex-wrap">
          <Select
            selectedKey={selectedFile || null}
            onSelectionChange={(key: Key | null) => setSelectedFile(String(key ?? 'latest.log'))}
            className="min-w-[160px]"
          >
            <Select.Trigger className="bg-input-bg border border-border-theme text-text-primary rounded-xl px-3 py-2 text-sm outline-none focus:border-accent transition-colors">
              <Select.Value />
              <Select.Indicator />
            </Select.Trigger>
            <Select.Popover>
              <ListBox>
                {files.map(f => (
                  <ListBox.Item key={f.name} id={f.name} textValue={f.name}>
                    {f.name}
                  </ListBox.Item>
                ))}
              </ListBox>
            </Select.Popover>
          </Select>
          <input
            className="bg-input-bg border border-border-theme text-text-primary rounded-xl px-3 py-2 text-sm outline-none focus:border-accent transition-colors w-[100px]"
            type="number"
            value={lineCount}
            onChange={e => setLineCount(e.target.value)}
            placeholder="行数"
          />
          <Switch
            size="sm"
            isSelected={autoRefresh}
            onChange={(isSelected: boolean) => setAutoRefresh(isSelected)}
          >
            <span className="text-sm text-text-muted">自动刷新</span>
          </Switch>
          <Button size="sm" variant="ghost" onPress={loadLog}>刷新</Button>
        </div>
      </PageHeader>

      {info && <div className="text-xs text-text-muted mb-1">{info}</div>}

      <LogViewer lines={lines} colorized tall />
    </div>
  )
}
