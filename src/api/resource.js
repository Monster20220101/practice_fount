import request from '@/utils/request'
import axios from 'axios'
// 获取列表
export function getResourceList(data) {
  return request({
    url: '/resourceInfo/getResourceList',
    method: 'get',
    params: data
  })
}
// 添加
export function addResource(data) {
  return new Promise((resolve, reject) => {
    axios.post('http://localhost:8082/resourceInfo/addResource', data, {
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
export function deletedResource(data) {
  return request({
    url: '/resourceInfo/deletedResource',
    method: 'delete',
    data: data
  })
}



