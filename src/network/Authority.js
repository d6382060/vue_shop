import { request } from './request'

// 左侧菜单权限
export function getMneus () {
  return request({
    url: 'menus'
  })
}

// 所有权限列表
export function getrightsList () {
  return request({
    url: 'rights/list'
  })
}


