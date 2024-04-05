import request from '@/utils/request'
// 获取任务列表
export function getTaskManagerList(data) {
  return request({
    url: '/taskInfo/getTaskManagerList',
    method: 'get',
    params: data
  })
}
// 修改任务
export function modifyTask(data) {
  return request({
    url: '/taskInfo/modifyTask',
    method: 'put',
    data: data
  })
}
// 添加任务
export function addTask(data) {
  return request({
    url: '/taskInfo/addTask',
    method: 'post',
    data: data
  })
}
// 删除任务
export function deletedTask(data) {
  return request({
    url: '/taskInfo/deletedTask',
    method: 'delete',
    data: data
  })
}

// 获取任务详情
export function getTaskById(data) {
  return request({
    url: '/taskInfo/getTaskById',
    method: 'get',
    params: data
  })
}
// 获取学生带成绩
export function getStudentScoreList(data) {
  return request({
    url: '/taskInfo/getStudentScoreList',
    method: 'get',
    params: data
  })
}
// 添加或更新学生分数
export function scoreForStudent(data) {
  return request({
    url: '/taskInfo/score',
    method: 'post',
    data: data
  })
}


// 【学生端】
export function getTaskListForStudent(data) {
  return request({
    url: '/taskInfo/getTaskListForStudent',
    method: 'get',
    params: data
  })
}
