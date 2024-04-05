import request from '@/utils/request'
// 获取班级列表
export function getClassList(data) {
  return request({
    url: '/classInfo/getClassList',
    method: 'get',
    params: data
  })
}
// 修改班级
export function modifyClass(data) {
  return request({
    url: '/classInfo/modify',
    method: 'put',
    data: data
  })
}
// 添加班级
export function addClass(data) {
  return request({
    url: '/classInfo/add',
    method: 'post',
    data: data
  })
}
// 删除班级
export function deletedClass(data) {
  return request({
    url: '/classInfo/deleted',
    method: 'delete',
    data: data
  })
}
