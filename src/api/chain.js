import request from '@/utils/request'

export function getApplyList(searchData, page = 0, size = 20) {
  return request({
    url: '/apply/list',
    method: 'post',
    data: {
      search: searchData,
      page,
      size
    }
  })
}

export function changeApplyStatus(id, status) {
  return request({
    url: '/apply/update',
    method: 'post',
    data: {
      id,
      status //0未审批 1同意 2拒绝
    }
  })
}

export function addApply(data) {
  return request({
    url: '/apply/add',
    method: 'post',
    data
  })
}

export function getSystemList(searchData, page = 0, size = 20) {
  return request({
    url: '/system/list',
    method: 'post',
    data: {
      search: searchData,
      page,
      size
    }
  })
}

export function addSystem(data) {
  return request({
    url: '/system/add',
    method: 'post',
    data
  })
}

export function deleteSystem(id) {
  return request({
    url: '/system/delete',
    method: 'post',
    data: {
      sid: id
    }
  })
}

export function modifySystem(data) {
  return request({
    url: '/system/update',
    method: 'post',
    data
  })
}
