import request from '@/utils/request'

export function getMessageList(page, size = 20) {
  return request({
    url: '/message/list',
    method: 'post',
    data: {
      page,
      size
    }
  })
}

export function addMessage(data) {
  return request({
    url: '/message/add',
    method: 'post',
    data
  })
}

export function deleteMessage(id) {
  return request({
    url: '/message/delete',
    method: 'post',
    data:{
      id
    }
  })
}
