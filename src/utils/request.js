import axios from 'axios'
import router from '@/router'
import { ElMessage } from 'element-plus'
// 创建axios实例
const service = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api', // api的base_url
  timeout: 5000, // 请求超时时间
  withCredentials: true // 跨域请求时发送cookies
})

// 请求拦截器
service.interceptors.request.use(
  (config) => {
    // 在发送请求之前做些什么
    const token = localStorage.getItem('token')
    if (token) {
      config.headers['token'] = token
    }
    return config
  },
  (error) => {
    // 对请求错误做些什么
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  (response) => {
    // 错了的话改这里
    // const {data,config} = response.data
    const data = response.data
    const config = response.config
    // 如果返回的状态码为200，说明接口请求成功，可以正常拿到数据
    // 否则的话抛出错误
    if (data.code === '200' || data.code === 200) {
      return data.data
    }
    if (data.code === -1) {
      if (config.url?.includes('/user/add')) {
        return data
      }
      if (!config.url?.includes('/login')) {
        ElMessage.error(data.msg || '登录过期，请重新登录')
        localStorage.removeItem('token')
        localStorage.removeItem('userInfo')
        window.location.href = 'auth/login'
      } else {
        ElMessage.error(data.msg || '登录过期，请重新登录')
      }
      return Promise.reject('网络请求失败')
    }
    // 其他非200状态码，返回原始响应数据让调用方自行处理
    return data
  },
  (error) => {
    console.log('err' + error) // for debug
    return Promise.reject(error)
  }
)

export default service
