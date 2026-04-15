import { useState, useEffect } from 'react'
import { Button } from '@heroui/react'
import { toast } from '@heroui/react'
import { motion } from 'framer-motion'
import { useAppStore } from '../stores/app-store'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { listBots, sendMessage } from '../api/endpoints'
import PageHeader from '../components/shared/PageHeader'
import BotSelect from '../components/shared/BotSelect'
import QQHistoryInput from '../components/shared/QQHistoryInput'

export default function MessagesPage() {
  const { setCachedBots, appendLog } = useAppStore()
  const [bot, setBot] = useState('')
  const [msgType, setMsgType] = useLocalStorage('msgType', 'group')
  const [target, setTarget] = useState('')
  const [message, setMessage] = useState('')
  const [sending, setSending] = useState(false)

  useEffect(() => {
    listBots().then(data => {
      if (data) setCachedBots(data.bots || [], data.activeBot)
    })
  }, [setCachedBots])

  const handleSend = async () => {
    if (!bot) { toast.danger('请选择 Bot'); return }
    const targetNum = parseInt(target)
    if (!targetNum) { toast.danger('请输入目标'); return }
    if (!message.trim()) { toast.danger('请输入消息'); return }

    setSending(true)
    const data = await sendMessage(bot, msgType, targetNum, message.trim())
    setSending(false)

    if (data !== null) {
      toast.success('消息已发送')
      appendLog(`[${bot}] ${msgType === 'group' ? '群' : '私聊'}消息 -> ${target}: ${message.trim()}`)
      setMessage('')
    }
  }

  return (
    <div>
      <PageHeader title="消息发送" />

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
        className="max-w-[600px] space-y-4"
      >
        {/* Bot Select */}
        <div>
          <label className="text-sm text-text-muted mb-1 block">选择 Bot</label>
          <BotSelect storageKey="select_msgBotSelect" connectedOnly value={bot} onChange={setBot} />
        </div>

        {/* Message Type */}
        <div>
          <label className="text-sm text-text-muted mb-1 block">消息类型</label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 text-text-primary text-sm cursor-pointer">
              <input
                type="radio"
                name="msgType"
                value="group"
                checked={msgType === 'group'}
                onChange={() => setMsgType('group')}
                className="accent-accent"
              />
              群消息
            </label>
            <label className="flex items-center gap-2 text-text-primary text-sm cursor-pointer">
              <input
                type="radio"
                name="msgType"
                value="private"
                checked={msgType === 'private'}
                onChange={() => setMsgType('private')}
                className="accent-accent"
              />
              私聊消息
            </label>
          </div>
        </div>

        {/* Target QQ */}
        <div>
          <label className="text-sm text-text-muted mb-1 block">
            目标 <span className="text-text-muted">{msgType === 'group' ? '(群号)' : '(QQ号)'}</span>
          </label>
          <QQHistoryInput
            storageKey="msgTarget"
            placeholder={msgType === 'group' ? '群号' : 'QQ号'}
            value={target}
            onChange={setTarget}
          />
        </div>

        {/* Message Content */}
        <div>
          <label className="text-sm text-text-muted mb-1 block">消息内容</label>
          <textarea
            className="bg-input-bg border border-border-theme text-text-primary rounded-xl px-3 py-2 text-sm outline-none focus:border-accent transition-colors w-full min-h-[80px] resize-y"
            value={message}
            onChange={e => setMessage(e.target.value)}
            placeholder="输入消息内容..."
          />
        </div>

        {/* Send Button */}
        <Button
          variant="primary"
          isDisabled={sending}
          onPress={handleSend}
        >
          发送消息
        </Button>
      </motion.div>
    </div>
  )
}
