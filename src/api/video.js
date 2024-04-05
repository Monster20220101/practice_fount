import request from '@/utils/request'
import axios from 'axios'
// 获取列表
export function getVideoList(data) {
  return request({
    url: '/videoInfo/getVideoList',
    method: 'get',
    params: data
  })
}
// 添加
export function addVideo(data) {
  return new Promise((resolve, reject) => {
    axios.post('http://localhost:8082/videoInfo/addVideo', data, {
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
export function deletedVideo(data) {
  return request({
    url: '/videoInfo/deletedVideo',
    method: 'delete',
    data: data
  })
}



