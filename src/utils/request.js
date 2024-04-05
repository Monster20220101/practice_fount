import settings from '../settings'
import axios from 'axios'
import { Toast } from 'vant'

import router from '../router'

var service = axios.create({
  baseURL: settings.target,
  timeout: 30000
})


service.interceptors.request.use((config) => {
  // npgrogress.start()
  const token = localStorage.getItem('token')
  if (token) {
    config.headers['Authorization'] = token
  }
  return config
})

service.interceptors.response.use((res) => {
  console.log('===================================')
  console.log(res)
  console.log('===================================')
  const data = res.data
  if (data.code !== 200) {
    if (data.code === 401 || data.code === 403) {
      Toast('身份认证已过期，请重新登录')
      router.push('/login')
    } else {
      Toast(data.msg)
    }
    return Promise.reject(data.msg)
  } else {
    return res // 我魔改了 本来是data即res.data
  }
}, (err) => {
  console.log('××××××××××××××××××××××××')
  console.log(err)
  console.log('××××××××××××××××××××××××')
  if (err.response.data) {
    err.msg = err.response.data.msg
  }
  Toast(err.msg)
  if (err.response.status === 401) {
    Toast('无权限：' + err.msg)
    router.go(-1)
  } else {
    Toast(err.msg)
  }
})

export default function request(data) {
  // if (data.method.toLowerCase() === 'get') {
  //   data.params = data.data
  //   delete data.data
  // }
  return service(data)
}

