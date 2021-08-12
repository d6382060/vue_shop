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

//  角色列表信息
export function getRoleList () {
  return request({
    url: 'roles',
  })
}

//  添加角色-角色列表
export function addRoles (data) {
  return request({
    url: 'roles',
    method: 'post',
    data
  })
}

//  根据 ID 查询角色-角色列表
export function rolesList (id) {
  return request({
    url: `roles/${id}`,
  })
}

// 编辑提交角色
export function editGitUser (id, data) {
  return request({
    url: `roles/${id}`,
    method: 'put',
    data
  })
}

// 删除角色---角色列表
export function deleteRolesList (id) {
  return request({
    url: `roles/${id}`,
    method: 'delete'
  })
}

// 删除角色指定权限

export function deleteUserAu (userid, auid) {
  return request({
    url: `roles/${userid}/rights/${auid}`,
    method: 'delete'
  })
}


// 获取所有权限列表

export function getRightsList () {
  return request({
    url: 'rights/tree',
  })
}

// 角色权限授权

export function rolesAuthority (roleId, idStr) {
  return request({
    url: `roles/${roleId}/rights`,
    method: 'post',
    data: {
      rids: idStr
    }
  })
}

// 获取角色列表---分配角色面板
export function geDistributetRolesList () {
  return request({
    url: 'roles'
  })
}

// 分配用户角色---分配角色面板
export function Distributetusers (id, rid) {
  return request({
    url: `users/${id}/role`,
    method: 'put',
    data: {
      rid
    }
  })
}
