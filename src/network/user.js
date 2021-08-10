import { request } from './request'

// 登录请求
export function login (data) {
  return request({
    url: 'login',
    method: 'post',
    data
  })
}

// 用户数据列表
export function getusersList (params) {
  return request({
    url: 'users',
    params
  })
}


// 修改用户状态
export function modifyStatus (uid, type) {
  return request({
    url: `users/${uid}/state/${type}`,
    method: 'put'
  })
}

// 添加用户
export function addusers (data) {
  return request({
    url: 'users',
    method: 'post',
    data
  })
}

//  根据 ID 查询用户信息
export function getUsersInfo (id) {
  return request({
    url: `users/${id}`
  })
}

//  编辑用户提交
export function editUser (id, data) {
  return request({
    url: `users/${id}`,
    method: 'put',
    data
  })
}

//  删除用户信息
export function deletetUserInfo (id) {
  return request({
    url: `users/${id}`,
    method: 'delete'
  })
}