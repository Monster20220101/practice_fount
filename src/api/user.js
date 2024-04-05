import request from '../utils/request'
import axios from 'axios'

// 前端规范：一个页面一个api的xxx.js
export function login(data) {
  return request({
    url: '/userInfo/login',
    method: 'post',
    data: data
  })
}

export function register(data) {
  return request({
    url: '/userInfo/register',
    method: 'post',
    data: data
  })
}

export function logout(data) {
  return request({
    url: '/userInfo/logout',
    method: 'get',
    data: data
  })
}

export function updatePassword(data) {
  return request({
    url: '/userInfo/updatePassword',
    method: 'post',
    data: data
  })
}

export function updateUserAva(data) {
  return new Promise((resolve, reject) => {
    const formData = new FormData()
    formData.append('files', data.file)
    axios.post('http://localhost:8082/userInfo/updateUserAva', formData, {
      headers: {
        'content-type': 'multipart/form-data',
        'Authorization': localStorage.getItem('token')
      }
    }).then(res => {
      resolve(res)
    })
  })
}

export function updateTelephone(data) {
  return request({
    url: '/userInfo/updateTelephone',
    method: 'post',
    data: data
  })
}
