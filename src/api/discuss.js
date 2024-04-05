import request from '@/utils/request'
import axios from 'axios'
// 获取列表
export function getDiscussList(data) {
  return request({
    url: '/discussInfo/getDiscussList',
    method: 'get',
    params: data
  })
}
// 获取回复列表
export function getReplyList(data) {
  return request({
    url: '/discussInfo/getReplyList',
    method: 'get',
    params: data
  })
}
// 添加
export function addDiscuss(data) {
  return new Promise((resolve, reject) => {
    axios.post('http://localhost:8082/discussInfo/addDiscuss', data, {
      headers: {
        'content-type': 'multipart/form-data',
        'Authorization': localStorage.getItem('token')
      }
    }).then(res => {
      resolve(res)
    })
  })
}

// 删除
export function deletedDiscuss(data) {
  return request({
    url: '/discussInfo/deletedDiscuss',
    method: 'delete',
    data: data
  })
}
