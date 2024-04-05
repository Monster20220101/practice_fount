import request from '@/utils/request'
// 获取学生列表
export function getStudentList(data) {
  return request({
    url: '/studentInfo/getStudentList',
    method: 'get',
    params: data
  })
}
// 添加学生
export function addStudent(data) {
  return request({
    url: '/studentInfo/add',
    method: 'post',
    data: data
  })
}
// 删除学生
export function deletedStudent(data) {
  return request({
    url: '/studentInfo/deleted',
    method: 'delete',
    data: data
  })
}
// 修改学生
export function modifyStudent(data) {
  return request({
    url: '/studentInfo/modify',
    method: 'put',
    data: data
  })
}
