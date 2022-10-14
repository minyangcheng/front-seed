import request from '@/utils/request'

export function getOrderList(searchData = {}, page = 0, size = 20, noLoading = false) {
  return request({
    url: '/order/list',
    method: 'post',
    headers: { 'no-loading': noLoading },
    data: {
      ...searchData,
      page,
      size
    }
  })
}

export function updateOrder(data) {
  return request({
    url: '/order/update',
    method: 'post',
    data
  })
}

export function addOrder(data) {
  return request({
    url: '/order/add',
    method: 'post',
    data
  })
}

export function deleteOrder(id) {
  return request({
    url: '/order/delete',
    method: 'post',
    data: {
      id
    }
  })
}

