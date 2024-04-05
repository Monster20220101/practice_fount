import request from '@/utils/request'

// 获取列表
export function getList(data) {
  return request({
    url: '/dailyReport/getList',
    method: 'get',
    params: data
  })
}
// 修改
export function modifyDailyReport(data) {
  return request({
    url: '/dailyReport/modifyDailyReport',
    method: 'put',
    data: data
  })
}
// 添加
export function addDailyReport(data) {
  return request({
    url: '/dailyReport/addDailyReport',
    method: 'post',
    data: data
  })
}
// 删除
export function deletedDailyReport(data) {
  return request({
    url: '/dailyReport/deletedDailyReport',
    method: 'delete',
    data: data
  })
}
