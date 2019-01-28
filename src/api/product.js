import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/product/list',
    method: 'get',
    params
  })
}

export function fetchList(params) {
  return request({
    url: '/product/list',
    method: 'get',
    params
  })
}

export function fetchPv(params) {
  return request({
    url: '/table/list',
    method: 'get',
    params
  })
}

export function createProduct(params) {
  return request({
    url: '/product/add',
    method: 'post',
    data: params
  })
}

export function updateProduct(params) {
  return request({
    url: '/product/update',
    method: 'post',
    data: params
  })
}

export function getOptions(params) {
  return request({
    url: '/product/options',
    method: 'get',
    params
  })
}

export function getCategorys(params) {
  return request({
    url: '/product/categorys',
    method: 'get',
    params
  })
}

export function getWebsite(params) {
  return request({
    url: '/product/website',
    method: 'get',
    params
  })
}
