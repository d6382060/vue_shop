import { request } from './request'

//  数据统计

// 用户数据列表
export function getreports () {
  return request({
    url: 'reports/type/1',
  })
}
