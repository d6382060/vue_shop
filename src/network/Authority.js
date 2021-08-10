import { request } from './request'

// 左侧菜单权限
export function getMneus () {
  return request({
    url: 'menus'
  })
}

