import request from '@/utils/request'

export function hellow(data) {
  return request({
    url: '/hellow',
    method: 'get',
    data
  })
}
