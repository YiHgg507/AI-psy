import service from '@/utils/request'
// 需要username和password两个参数
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
