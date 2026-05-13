import service from '@/utils/request'
// 需要username和password两个参数

// 知识文章
export function login(data) {
  return service.post('./user/login', data)
}

// 只需要token  不需要参数
export function categoryTree() {
  return service.get('/knowledge/category/tree')
}

export function articlePage(params) {
  return service.get('/knowledge/article/page', { params })
}

export function uploadFile(file, bussinessInfo) {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('businessType', 'ARTICLE')
  formData.append('businessId', bussinessInfo.bussinessId)
  formData.append('businessField', 'cover')
  return service.post('/file/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

export function submitFile(data) {
  return service.post('/knowledge/article', data)
}

export function getArticleDetail(id) {
  return service.get(`/knowledge/article/${id}`)
}

export function updateArticle(id, data) {
  return service.put(`/knowledge/article/${id}`, data)
}

export function changeArticleStatus(id, data) {
  return service.put(`/knowledge/article/${id}/status`, data)
}

export function deleteArticle(id) {
  return service.delete(`/knowledge/article/${id}`)
}

// 获取咨询记录列表
export function getSessionChat(params) {
  return service.get('/psychological-chat/sessions', { params })
}

// 获取咨询记录详情
export function getSessionDetail(sessionId) {
  return service.get(`/psychological-chat/sessions/${sessionId}/messages`)
}

// 情绪日记
export function getMoodList(params) {
  return service.get('/emotion-diary/admin/page', { params })
}

// 删除情绪日记记录

export function deleteMoodRecord(id) {
  return service.delete(`/emotion-diary/admin/${id}`)
}

// 获取综合分析
export function getComAnalysis() {
  return service.get('/data-analytics/overview')
}

// 退出登录
export function logout() {
  return service.post('/user/logout')
}
