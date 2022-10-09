import request from '@/utils/request'

export function getStoreList(searchData = {}, page = 0, size = 20, noLoading = false) {
  return request({
    url: '/store/list',
    method: 'post',
    headers: { 'no-loading': noLoading },
    data: {
      search: searchData,
      page,
      size
    }
  })
}

export function updateStore(data) {
  return request({
    url: '/store/update',
    method: 'post',
    data
  })
}

export function addStore(data) {
  return request({
    url: '/store/add',
    method: 'post',
    data
  })
}

export function deleteStore(id) {
  return request({
    url: '/store/delete',
    method: 'post',
    data: {
      id
    }
  })
}

export function bindToDealer(userId, storeIds) {
  return request({
    url: '/store/link',
    method: 'post',
    data: {
      id: userId,
      storeId: storeIds
    }
  })
}

export function bindToDealerFromUser(userId, storeIds) {
  return request({
    url: '/user/link',
    method: 'post',
    data: {
      id: userId,
      storeId: storeIds
    }
  })
}

export function getHasBindStoreList(userId) {
  return request({
    url: '/store/searchStoreByid',
    method: 'post',
    data: {
      search: {
        id: userId
      }
    }
  })
}

export function getStoreListByAreaQuery(storeName = '', page = 0, size = 20) {
  return request({
    url: '/store/searchOwner',
    method: 'post',
    data: {
      search: {
        storeName
      },
      page,
      size
    }
  })
}

