import { request } from './request'

// 商品分类数据列表
export function getGoodsList (params) {
  return request({
    url: 'categories',
    params
  })
}


// 添加分类
export function addCatwGories (data) {
  return request({
    url: 'categories',
    method: 'post',
    data
  })
}


// 编辑提交分类分类
export function editCate (id, cat_name) {
  return request({
    url: `categories/${id}`,
    method: 'put',
    data: {
      cat_name
    }
  })
}

// 查询分类名称
export function getCatename (id) {
  return request({
    url: `categories/${id}`,
    method: 'get'
  })
}


// 删除分类
export function deleteCategories (id) {
  return request({
    url: `categories/${id}`,
    method: 'delete'
  })
}

//  参数列表
export function getAttributeslist (id, data) {
  return request({
    url: `categories/${id}/attributes`,
    params: {
      sel: data
    }
  })
}

//  添加动态参数或者静态属性
export function addAttributes (id, data) {
  return request({
    url: `categories/${id}/attributes`,
    method: 'post',
    data
  })
}

//   根据 ID 查询参数
export function getIdattrId (id, attrId, sel) {
  return request({
    url: `categories/${id}/attributes/${attrId}`,
    params: {
      attr_sel: sel
    }
  })
}

//   编辑提交参数
export function editPushAttrId (id, attrId, data) {
  return request({
    url: `categories/${id}/attributes/${attrId}`,
    method: 'put',
    data
  })
}


//   删除参数
export function deleteAttrids (id, attrId) {
  return request({
    url: `categories/${id}/attributes/${attrId}`,
    method: 'delete',
  })
}


//    编辑提交参数
export function editSubmitAttrId (id, attrId, data) {
  return request({
    url: `categories/${id}/attributes/${attrId}`,
    method: 'put',
    data
  })
}