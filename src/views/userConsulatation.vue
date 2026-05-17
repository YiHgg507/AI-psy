<template>
  <div class="consultation-container">
    <div class="sidebar">
      <!-- AI助手 -->
      <div class="ai-assistant-info">
        <div class="breathing-circle">
          <el-image :src="iconURL1" style="width: 30px"></el-image>
        </div>
        <h3 class="assistant-name">心理AI助手</h3>
        <div class="online-status">
          <div class="status-dot"></div>
          在线服务中
        </div>
      </div>
      <!-- 情绪花园 -->
      <div class="emotion-garden">
        <div class="garden-header">
          <div class="garden-title">情绪花园</div>
        </div>
        <div class="emotion-info">
          <div class="emotion-name">中性</div>
          <div class="emotion-score">50</div>
        </div>
        <div class="warm-tips">
          <div class="emotion-status-text">
            <span class="status-label">今天感觉：</span>
            <span class="status-emotion">{{
              currentEmotion.isNegative ? '需要关注' : '很不错'
            }}</span>
          </div>
          <div class="emotion-intensity">
            <span class="intensity-dots">
              <span
                v-for="dot in 3"
                :key="dot"
                class="dot"
                :class="{ active: getIntensityClass(currentEmotion.emotionScore) >= dot }"
              ></span>
            </span>
            <span class="intensity-text">
              {{ getRiskText(currentEmotion.risklevel) }}
            </span>
          </div>
          <!-- 建议卡片 -->
          <div class="warm-suggestion">
            <div class="suggestion-icon">💝</div>
            <div class="suggestion-content">
              <div class="suggestion-title">给你的小建议</div>
              <div class="suggestion-text" v-if="currentEmotion.suggestion">
                {{ currentEmotion.suggestion }}
              </div>
            </div>
          </div>
          <!-- 治愈行动 -->
          <div class="healing-actions" v-if="currentEmotion.improvementSuggestions.length > 0">
            <div class="action-title">
              <div class="actions-list">
                <div
                  class="action-item"
                  v-for="action in currentEmotion.improvementSuggestions"
                  :key="action"
                >
                  <div class="action-icon">✨</div>
                  <div class="action-text">{{ action }}</div>
                </div>
              </div>
            </div>
          </div>
          <!-- 风险提醒 -->
          <div class="risk-notice">
            <div class="notice-icon">🤗</div>
            <div class="notice-content">
              <div class="notice-title">温馨提示</div>
              <div class="notice-text">{{ currentEmotion.riskDescription }}</div>
            </div>
          </div>
        </div>
      </div>
      <!-- 会话历史 -->
      <div class="session-history">
        <h4 class="session-title">会话列表</h4>
        <div class="session-list">
          <div
            v-for="session in sessionList"
            :key="session.id"
            class="session-item"
            @click="handleSessionClick(session)"
          >
            <div class="session-info">
              <div class="session-title-AI">
                <span>{{ session.sessionTitle }}</span>
                <div class="session-meta">
                  <span class="session-time">{{ session.startedAt }}</span>
                </div>
                <div class="session-preview">{{ session.lastMessageContent }}</div>
                <div class="session-stats">
                  <span>
                    <el-icon><chatRound /></el-icon>
                    {{ session.messageCount || 0 }}
                  </span>
                  <span>
                    <el-icon><Clock /></el-icon>
                    {{ session.durationMinutes || 0 }}分钟
                  </span>
                </div>
              </div>
              <div class="session-actions">
                <el-button text type="danger" size="small" @click="handleDeleteSession(session.id)">
                  <el-icon><DeleteFilled /></el-icon>
                </el-button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="chat-main">
      <div class="chat-header">
        <div class="header-left">
          <div class="chat-avatar">
            <el-image :src="iconURL2" style="width: 30px"></el-image>
          </div>
          <div class="chat-info">
            <h2>心理AI助手</h2>
            <p>您的贴心心理健康助手</p>
          </div>
        </div>
        <el-button size="large" circle @click="createNewFrontendSession" title="新建会话">
          <el-icon><Plus /></el-icon>
        </el-button>
      </div>
      <!-- 聊天框初始显示 -->
      <div ref="chatMessagesRef" class="chat-messages">
        <div class="message-item ai-message" v-if="messages.length === 0">
          <div class="message-avatar">
            <el-image :src="iconURL1" style="width: 20px"></el-image>
          </div>
          <div class="message-content">
            <div class="message-bubble">
              您好，我是您的心理AI助手，很高兴陪伴您，为您提供温暖的心理支持，请告诉我，今天您感觉怎么样？有什么想要分享的吗？
            </div>
            <div class="message-time">刚刚</div>
          </div>
        </div>

        <div
          class="message-item"
          v-for="msg in messages"
          :key="msg.id"
          :class="msg.senderType === 1 ? 'user-message' : 'ai-message'"
        >
          <div class="message-avatar">
            <el-image v-if="msg.senderType === 1" :src="iconURL3" style="width: 20px"></el-image>
            <el-image v-if="msg.senderType === 2" :src="iconURL1" style="width: 20px"></el-image>
          </div>

          <div class="message-content">
            <div class="message-bubble">
              <div
                class="typing-indicator"
                v-if="
                  msg.senderType === 2 &&
                  isAISending &&
                  !msg.content &&
                  msg.id === streamingMessageId
                "
              >
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
              </div>

              <div class="error-message" v-else-if="msg.isError">
                <p>{{ msg.content }}</p>
              </div>

              <MarkDownRenderer
                v-else-if="msg.senderType === 2 && !msg.isError"
                :content="msg.content"
                :is-ai-message="true"
              />

              <p v-else-if="msg.content" v-html="formatMessageContent(msg.content)"></p>
            </div>

            <div class="message-time">
              {{
                msg.senderType === 2 && isAISending && msg.id === streamingMessageId
                  ? '正在输入中...'
                  : formatTime(msg.createdAt)
              }}
            </div>
          </div>
        </div>
      </div>
      <div class="chat-input">
        <div class="input-container">
          <el-input
            placeholder="请输入您想要分享的内容..."
            type="textarea"
            v-model="userMessage"
            class="message-input"
            :rows="3"
            :disabled="isAISending"
            @keydown.enter="handleKeydown"
            resize="none"
            clearable
          ></el-input>
          <div class="input-footer">
            <span>按Enter发送，按Shift+Enter换行</span>
            <span>{{ userMessage.length }}/500</span>
          </div>
        </div>
        <el-button
          :disabled="!userMessage.trim() || userMessage.length > 500 || isAISending"
          class="send-btn"
          type="primary"
          @click="sendMessage"
        >
          <el-icon><Promotion /></el-icon>
        </el-button>
        <div class="input-footer"></div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { startSession, getSessionList, deleteSession, getSessionDetail } from '@/api/frontend'
import { ElMessage, ElMessageBox } from 'element-plus'
import MarkDownRenderer from '@/components/MarkdownRenderer.vue'
import { fetchEventSource } from '@microsoft/fetch-event-source'

const iconURL1 = new URL('@/assets/robot-fill.png', import.meta.url).href
const iconURL2 = new URL('@/assets/like.png', import.meta.url).href
const iconURL3 = new URL('@/assets/users.png', import.meta.url).href

// 情绪花园

const currentEmotion = ref({
  primaryEmotion: '中性',
  emotionScore: 50,
  isNegative: false,
  risklevel: 0,
  suggestion: '情绪状态平稳',
  improvementSuggestions: [],
  riskDescription: ''
})
// 获取强度等级
const getIntensityClass = (score) => {
  if (score >= 61) {
    return 3
  } else if (score >= 41) {
    return 2
  }
  return 1
}
// 获取Risk
const getRiskText = (level) => {
  switch (level) {
    case 0:
      return '正常'
    case 2:
      return '关注'
    case 3:
      return '预警'
    case 4:
      return '危机'
    default:
      return '正常'
  }
}

// 聊天滚动
const chatMessagesRef = ref(null)
const scrollToBottom = () => {
  nextTick(() => {
    const el = chatMessagesRef.value
    if (el) el.scrollTop = el.scrollHeight
  })
}

// 新建会话逻辑
const currentSession = ref(null)
const createNewFrontendSession = () => {
  activeStreamCtrl.value?.abort()
  isAISending.value = false
  streamingMessageId.value = null
  const NewSession = {
    sessionId: `temp_${Date.now()}`,
    status: 'TEMP',
    sessionTitle: '新会话'
  }
  currentSession.value = NewSession
  messages.value = []
  scrollToBottom()
}

// 新建会话接口函数定义
const startNewSession = (message) => {
  // 定义后端接收参数
  // 1. initialMessage: 初始化消息，可以是用户输入的，也可以是预设的
  // 2. sessionTitle: 会话标题，默认为：心理AI助手-时间
  const sessionParams = {
    initialMessage: message
  }
  // 判断当前会话是否为新会话 若是，则标题默认创建，若不是则获取会话标题
  if (!currentSession.value || currentSession.value.sessionTitle === '新会话') {
    sessionParams.sessionTitle = `心理AI助手-${new Date().toLocaleString()}`
  } else {
    sessionParams.sessionTitle = currentSession.value.sessionTitle
  }
  // 调用接口创建新会话
  startSession(sessionParams).then((res) => {
    const { sessionId, status } = res
    const sessionData = {
      sessionId: sessionId,
      status: status,
      sessionTitle: sessionParams.sessionTitle
    }
    // 如果是临时对话，就更新数据
    if (currentSession.value && currentSession.value.status === 'TEMP') {
      // 更新为正式会话
      Object.assign(currentSession.value, sessionData)
    } else if (!currentSession.value) {
      // 没有会话时直接创建
      currentSession.value = sessionData
    }
    // 更新会话列表
    getSessionPageList()
    // 添加用户消息
    messages.value.push({
      id: Date.now(),
      senderType: 1,
      content: message,
      createdAt: new Date().toISOString()
    })
    scrollToBottom()
    // 流式对话
    startAIResponse(sessionData.sessionId, message)
  })
}

const activeStreamCtrl = ref(null)
const streamingMessageId = ref(null)

const startAIResponse = (sessionId, userMessage) => {
  // 防止重复发送
  if (isAISending.value) {
    ElMessage.error('AI助手正在输入中，请稍后')
    return
  }
  // 中断旧的 SSE 连接
  activeStreamCtrl.value?.abort()
  isAISending.value = true
  const AIMessage = {
    id: `ai_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
    senderType: 2,
    content: '',
    createdAt: new Date().toISOString()
  }
  messages.value.push(AIMessage)
  scrollToBottom()
  streamingMessageId.value = AIMessage.id

  //调用流式接口
  const ctrl = new AbortController() //用来终止fetch
  activeStreamCtrl.value = ctrl
  fetchEventSource('/api/psychological-chat/stream', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Token: localStorage.getItem('token'),
      Accept: 'text/event-stream'
    },
    body: JSON.stringify({
      sessionId,
      userMessage
    }),
    signal: ctrl.signal,
    onopen: async (response) => {
      if (response.ok && response.headers.get('Content-Type') !== 'text/event-stream') {
        ElMessage.warning('服务器返回非流式数据')
      }
      if (!response.ok) {
        let errorMsg = `请求失败 (${response.status})`
        try {
          const body = await response.text()
          if (body) errorMsg += `: ${body}`
        } catch {
          // ignore
        }
        throw new Error(errorMsg)
      }
    },
    onmessage: (event) => {
      const raw = event.data.trim()
      if (!raw) return
      const eventName = event.event
      // 当前会话的AI消息
      const AIMessage = messages.value[messages.value.length - 1]

      if (eventName === 'done') {
        isAISending.value = false
        streamingMessageId.value = null
        ctrl.abort()
        return
      }
      try {
        const payload = JSON.parse(raw)
        const ok = String(payload.code) === '200'
        if (ok && payload.data && payload.data.content) {
          AIMessage.content += payload.data.content
          scrollToBottom()
        } else if (!ok) {
          handleError(payload.message || 'AI回复失败')
        }
      } catch {
        // JSON 解析失败，忽略非法数据
      }
    },
    onerror: (err) => {
      const msg = err?.message || err?.toString() || 'AI回复失败'
      handleError(msg)
    },
    onclose: () => {
      const AIMessage = messages.value[messages.value.length - 1]
      if (AIMessage && !AIMessage.content) {
        AIMessage.content = 'AI回复中断，请重试'
      }
      isAISending.value = false
      streamingMessageId.value = null
    }
  })
}

// 错误处理函数
const handleError = (error) => {
  streamingMessageId.value = null
  const AIMessage = messages.value[messages.value.length - 1]
  if (AIMessage) {
    AIMessage.content = 'AI回复失败,请重试'
  }
  isAISending.value = false
  ElMessage.error(error)
}

// 用户输入按钮逻辑
const userMessage = ref('')
const isAISending = ref(false)
const sendMessage = () => {
  if (!userMessage.value.trim()) return
  if (isAISending.value) {
    ElMessage.error('AI助手正在输入，请稍等...')
    return
  }
  const message = userMessage.value
  userMessage.value = ''
  // 如果是临时会话或者没有会话，就调用接口创建新会话
  if (!currentSession.value || currentSession.value?.status === 'TEMP') {
    startNewSession(message)
  } else {
    // 已存在会话：直接推送用户消息并调用 AI
    messages.value.push({
      id: Date.now(),
      senderType: 1,
      content: message,
      createdAt: new Date().toISOString()
    })
    scrollToBottom()
    startAIResponse(currentSession.value.sessionId, message)
  }
}

// 分页获取数据
const sessionList = ref([])
const getSessionPageList = async () => {
  const res = await getSessionList({
    pageNum: 1,
    pageSize: 10
  })
  sessionList.value = res.records
}

// 接收会话消息列表
const messages = ref([])
const handleSessionClick = async (session) => {
  activeStreamCtrl.value?.abort()
  isAISending.value = false
  streamingMessageId.value = null
  const res = await getSessionDetail(session.id)
  const sessionData = {
    sessionId: 'session_' + session.id,
    status: 'ACTIVE',
    sessionTitle: session.sessionTitle
  }
  currentSession.value = sessionData
  messages.value = res
  scrollToBottom()
}
const handleKeydown = (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault()
    sendMessage()
  }
}

const handleDeleteSession = async (sessionId) => {
  try {
    await ElMessageBox.confirm('确定要删除该会话吗？删除后不可恢复。', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
  } catch {
    return
  }
  await deleteSession(sessionId)
  ElMessage.success('删除成功')
  if (currentSession.value && currentSession.value.sessionId === 'session_' + sessionId) {
    currentSession.value = null
    messages.value = []
  }
  getSessionPageList()
}

// 格式化时间
const formatTime = (time) => {
  if (!time) return ''
  const d = new Date(time)
  if (isNaN(d.getTime())) return time
  const pad = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
}

// 处理用户输入文本
const formatMessageContent = (content) => {
  return content.replace(/\n/g, '<br/>')
}

onMounted(() => {
  getSessionPageList()
})
</script>
<style scoped lang="scss">
.consultation-container {
  margin: 0 auto;
  width: 1200px;
  display: flex;
  gap: 20px;
  padding: 20px;
  .sidebar {
    width: 320px;
    .ai-assistant-info {
      margin-bottom: 20px;
      background: linear-gradient(
        135deg,
        rgba(255, 255, 255, 0.9) 0%,
        rgba(255, 252, 248, 0.95) 100%
      );
      border-radius: 16px;
      padding: 16px;
      box-shadow:
        0 8px 32px rgba(251, 146, 60, 0.06),
        0 2px 8px rgba(0, 0, 0, 0.04);
      border: 1px solid rgba(251, 146, 60, 0.08);
      backdrop-filter: blur(10px);
      transition: all 0.3s ease;
      .breathing-circle {
        width: 60px;
        height: 60px;
        background: linear-gradient(135deg, #fb923c 0%, #f59e0b 100%);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto 12px;
        animation: breathing 4s ease-in-out infinite;
        box-shadow: 0 6px 24px rgba(251, 146, 60, 0.25);
        position: relative;
      }
      .assistant-name {
        font-size: 16px;
        font-weight: 700;
        background: linear-gradient(135deg, #fb923c, #f59e0b);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        text-align: center;
        background-clip: text;
        margin: 0 0 12px;
      }
      .online-status {
        display: flex;
        align-items: center;
        justify-content: center;
        color: #059669;
        font-size: 12px;
        font-weight: 600;
        .status-dot {
          width: 8px;
          height: 8px;
          background: #059669;
          border-radius: 50%;
          margin-right: 8px;
          animation: pulse 2s infinite;
          box-shadow: 0 0 8px rgba(5, 150, 105, 0.4);
        }
      }
    }
    .session-history {
      background: white;
      border-radius: 16px;
      padding: 16px;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
      margin-bottom: 20px;
      min-height: 250px;
      display: flex;
      flex-direction: column;
      .session-title {
        font-size: 16px;
        font-weight: 600;
        color: #333;
        margin: 0 0 16px;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      .session-list {
        overflow-y: auto;
        max-height: 200px;
        scrollbar-width: thin;
        scrollbar-color: rgba(64, 150, 255, 0.3) transparent;
        .session-item {
          position: relative;
          display: flex;
          align-items: flex-start;
          gap: 12px;
          padding: 12px;
          margin-bottom: 8px;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.3s ease;
          border: 2px solid transparent;
          &:hover {
            background: #f8f9ff;
            border-color: #e6f0ff;
          }
          &.active {
            background: #e6f0ff;
            border-color: #4096ff;
          }
          .session-info {
            flex: 1;
            .session-title-AI {
              font-weight: 500;
              font-size: 14px;
              color: #333;
              margin-bottom: 4px;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
              .session-meta {
                display: flex;
                align-items: center;
                gap: 8px;
                margin-bottom: 6px;
                .session-time {
                  font-size: 12px;
                  color: #999;
                }
              }
              .session-preview {
                width: 200px;
                font-size: 12px;
                color: #666;
                margin-bottom: 6px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
              }
              .session-stats {
                display: flex;
                align-items: center;
                gap: 12px;
                span {
                  font-size: 12px;
                  color: #999;
                  display: flex;
                  align-items: center;
                  gap: 4px;
                }
              }
            }
            .session-actions {
              position: absolute;
              top: 10px;
              right: 12px;
            }
          }
        }
        .no-sessions-text {
          text-align: center;
          font-size: 14px;
          color: #999;
        }
      }
    }
    .emotion-garden {
      background: linear-gradient(135deg, #fef9e7 0%, #fcf4e6 50%, #f6f0e8 100%);
      border-radius: 20px;
      padding: 16px;
      margin-bottom: 20px;
      box-shadow: 0 8px 32px rgba(252, 244, 230, 0.8);
      border: 1px solid rgba(255, 255, 255, 0.2);
      position: relative;
      overflow: hidden;
      min-height: 300px;

      .garden-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 20px;
        position: relative;
        z-index: 2;
        .garden-title {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 16px;
          font-weight: 600;
          color: #8b4513;
        }
      }
      .emotion-info {
        margin: 0 auto;
        width: 80px;
        height: 80px;
        border-radius: 50%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        z-index: 10;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
        border: 2px solid rgba(255, 255, 255, 0.8);
        background: linear-gradient(135deg, #ff9a9e 0%, #fecfef 50%, #fecfef 100%);
        color: #fff;
        .emotion-name {
          font-size: 15px;
          font-weight: 600;
          line-height: 1;
          margin-bottom: 2px;
        }
        .emotion-score {
          font-size: 14px;
          font-weight: 700;
          opacity: 0.9;
        }
      }
      .warm-tips {
        text-align: center;
        margin-bottom: 16px;
        .emotion-status-text {
          margin-bottom: 12px;
          .status-label {
            font-size: 14px;
            color: #8b7355;
            margin-right: 8px;
          }
          .status-emotion {
            font-size: 16px;
            font-weight: 600;
            padding: 4px 12px;
            border-radius: 16px;
            display: inline-block;
          }
        }
        .emotion-intensity {
          margin-bottom: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          .intensity-dots {
            display: flex;
            gap: 4px;
            .dot {
              width: 8px;
              height: 8px;
              border-radius: 50%;
              background: #e0e0e0;
              transition: all 0.3s ease;
              &.active {
                background: linear-gradient(135deg, #ff9a9e, #fecfef);
                transform: scale(1.2);
                box-shadow: 0 2px 8px rgba(255, 154, 158, 0.4);
              }
            }
          }
          .intensity-text {
            font-size: 12px;
            color: #8b7355;
            font-weight: 500;
          }
        }
        .warm-suggestion {
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.8));
          border-radius: 16px;
          padding: 12px;
          margin-bottom: 16px;
          display: flex;
          align-items: flex-start;
          gap: 10px;
          border: 1px solid rgba(255, 255, 255, 0.6);
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
          .suggestion-icon {
            font-size: 20px;
            flex-shrink: 0;
            margin-top: 2px;
          }
          .suggestion-content {
            text-align: left;
            flex: 1;
            .suggestion-title {
              font-size: 14px;
              font-weight: 600;
              color: #8b7355;
              margin-bottom: 6px;
            }
            .suggestion-text {
              font-size: 13px;
              color: #6b5b47;
              line-height: 1.5;
            }
          }
        }
        .healing-actions {
          margin-bottom: 16px;
          .actions-title {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            font-size: 14px;
            font-weight: 600;
            color: #8b7355;
            margin-bottom: 16px;
          }
          .actions-list {
            display: flex;
            flex-direction: column;
            gap: 10px;
            .action-item {
              background: linear-gradient(
                135deg,
                rgba(255, 255, 255, 0.9),
                rgba(255, 255, 255, 0.7)
              );
              border-radius: 12px;
              padding: 12px;
              display: flex;
              align-items: center;
              gap: 10px;
              border: 1px solid rgba(255, 255, 255, 0.5);
              box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
              text-align: left;
              .action-icon {
                font-size: 14px;
                color: #ffd700;
                flex-shrink: 0;
              }
              .action-text {
                font-size: 12px;
                color: #6b5b47;
                line-height: 1.4;
                flex: 1;
              }
            }
          }
        }
        .risk-notice {
          background: linear-gradient(135deg, #fff9e6, #ffeaa7);
          border-radius: 16px;
          padding: 16px;
          display: flex;
          align-items: flex-start;
          gap: 12px;
          border: 1px solid rgba(255, 234, 167, 0.6);
          box-shadow: 0 6px 20px rgba(255, 234, 167, 0.3);
          .notice-icon {
            font-size: 20px;
            flex-shrink: 0;
            margin-top: 2px;
          }
          .notice-content {
            flex: 1;
            .notice-title {
              font-size: 14px;
              font-weight: 600;
              color: #d4840f;
              margin-bottom: 6px;
            }
            .notice-text {
              font-size: 13px;
              color: #b8740c;
              line-height: 1.5;
            }
          }
        }
      }
    }
  }
  .chat-main {
    background: linear-gradient(
      135deg,
      rgba(255, 255, 255, 0.95) 0%,
      rgba(255, 252, 250, 0.98) 100%
    );
    border-radius: 20px;
    box-shadow:
      0 12px 40px rgba(251, 146, 60, 0.08),
      0 4px 16px rgba(0, 0, 0, 0.04);
    border: 1px solid rgba(251, 146, 60, 0.1);
    backdrop-filter: blur(10px);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    flex: 1;
    .chat-header {
      background: linear-gradient(135deg, #fb923c 0%, #f59e0b 100%);
      color: white;
      padding: 20px 24px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      position: relative;
      flex-shrink: 0;
      .header-left {
        display: flex;
        align-items: center;
        .chat-avatar {
          width: 48px;
          height: 48px;
          background: rgba(255, 255, 255, 0.25);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 16px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          position: relative;
          z-index: 1;
        }
        .chat-info {
          h2 {
            font-size: 20px;
            font-weight: 700;
            margin-bottom: 4px;
          }
          p {
            font-size: 14px;
          }
        }
      }
    }
    .chat-messages {
      flex: 1;
      overflow-y: auto;
      padding: 24px;
      display: flex;
      flex-direction: column;
      gap: 16px;
      background: linear-gradient(
        135deg,
        rgba(255, 255, 255, 0.02) 0%,
        rgba(255, 252, 248, 0.05) 100%
      );
      min-height: 0;
      max-height: calc(100vh - 200px);
      scrollbar-width: thin;
      scrollbar-color: rgba(251, 146, 60, 0.3) transparent;
      .message-item {
        display: flex;
        align-items: flex-start;
        gap: 12px;
        .message-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          color: white;
          flex-shrink: 0;
        }
        &.ai-message {
          .message-avatar {
            background: linear-gradient(135deg, #fb923c, #f59e0b);
            box-shadow: 0 4px 12px rgba(251, 146, 60, 0.3);
          }
        }
        &.user-message {
          flex-direction: row-reverse;
          .message-avatar {
            background: linear-gradient(135deg, #6b7280, #4b5563);
            box-shadow: 0 4px 12px rgba(107, 114, 128, 0.3);
          }
          .message-content {
            text-align: right;
          }
          .message-bubble {
            display: inline-block;
            text-align: left;
            max-width: 100%;
          }
          .message-time {
            text-align: right;
          }
        }
        .message-content {
          max-width: 70%;
          .message-bubble {
            background: linear-gradient(
              135deg,
              rgba(255, 255, 255, 0.9) 0%,
              rgba(255, 252, 248, 0.95) 100%
            );
            border-radius: 16px;
            padding: 12px 16px;
            position: relative;
            animation: fadeInUp 0.4s ease-out;
            border: 1px solid rgba(251, 146, 60, 0.1);
            box-shadow: 0 4px 16px rgba(251, 146, 60, 0.05);
            .typing-indicator {
              display: flex;
              gap: 4px;
              padding: 8px 0;
              .typing-dot {
                width: 8px;
                height: 8px;
                background: #ccc;
                border-radius: 50%;
                animation: typing 1.5s ease-in-out infinite;
                &:nth-child(2) {
                  animation-delay: 0.2s;
                }
                &:nth-child(3) {
                  animation-delay: 0.4s;
                }
              }
            }
            /* 错误消息样式 */
            .error-message {
              background: linear-gradient(135deg, #fef2f2 0%, #fecaca 100%);
              border: 1px solid #f87171;
              border-radius: 12px;
              padding: 12px 16px;
              color: #991b1b;
              font-weight: 500;
              display: flex;
              align-items: center;
              gap: 8px;
            }
          }
          .message-time {
            font-size: 12px;
            color: #999;
            margin-top: 4px;
          }
        }
      }
    }
    .chat-input {
      border-top: 1px solid rgba(251, 146, 60, 0.1);
      padding: 20px 24px;
      display: flex;
      gap: 12px;
      align-items: flex-end;
      background: linear-gradient(
        135deg,
        rgba(255, 255, 255, 0.5) 0%,
        rgba(255, 252, 248, 0.7) 100%
      );
      backdrop-filter: blur(10px);
      flex-shrink: 0;
      .input-container {
        flex: 1;
      }
      .input-footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 12px;
        color: #78716c;
        font-weight: 500;
      }
      .send-btn {
        height: 60px;
        width: 60px;
        border-radius: 16px;
        background: linear-gradient(135deg, #fb923c 0%, #f59e0b 100%) !important;
        border: none !important;
        box-shadow: 0 6px 20px rgba(251, 146, 60, 0.25);
        transition: all 0.3s ease;
      }
    }
  }
}
</style>
