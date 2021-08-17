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
// 查询分类名称
export function deleteCategories (id) {
  return request({
    url: `categories/${id}`,
    method: 'delete'
  })
}
