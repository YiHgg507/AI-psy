import service from '@/utils/request'

// 用户端
// 注册接口
export function userRegister(data) {
  return service.post('/user/add', data)
}

// 创建新会话
export function startSession(data) {
  return service.post('/psychological-chat/session/start', data)
}

// 分页查询会话
export function getSessionList(params) {
  return service.get('/psychological-chat/sessions', { params })
}

// 删除会话
export function deleteSession(sessionId) {
  return service.delete(`/psychological-chat/sessions/${sessionId}`)
}

// 获取会话消息列表
export function getSessionDetail(sessionId) {
  return service.get(`/psychological-chat/sessions/${sessionId}/messages`)
}

// 获取情绪分析结果
export function getSessionEmotion(sessionId) {
  return service.get(`/psychological-chat/session/${sessionId}/emotion`)
}

// 创建更新情绪日志
export function addEmotionDiary(data) {
  return service.post('/emotion-diary', data)
}
