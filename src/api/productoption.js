import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/productoption/list',
    method: 'get',
    params
  })
}

export function createOption(params) {
  return request({
    url: '/productoption/add',
    method: 'post',
    data: params
  })
}
