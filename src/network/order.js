import { request } from './request'
// 订单数据列表
export function orderDataList (params) {
  return request({
    url: 'orders',
    params
  })
}

