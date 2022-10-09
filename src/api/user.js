import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/login',
    method: 'post',
    data
  })
}

export function getInfo() {
  return request({
    url: '/user/myinfo',
    method: 'post'
  })
}

export function getUserList(username = '', dealerName = '', page = 0, size = 20) {
  return request({
    url: '/user/list',
    method: 'post',
    data: {
      search: {
        username,
        dealerName
      },
      page,
      size
    }
  })
}

export function deleteUser(id) {
  return request({
    url: '/user/delete',
    method: 'post',
    data: {
      id
    }
  })
}

export function updateUser(data) {
  return request({
    url: '/user/update',
    method: 'post',
    data
  })
}

export function addUser(data) {
  return request({
    url: '/user/add',
    method: 'post',
    data
  })
}

export function resetPassword(id) {
  return request({
    url: '/user/reset',
    method: 'post',
    data: {
      id
    }
  })
}

export function modifyPassword(oldPassword,newPassword) {
  return request({
    url: '/user/modifyPassword',
    method: 'post',
    data: {
      oldPassword,
      newPassword
    }
  })
}

export function logout() {
  return request({
    url: '/logout',
    method: 'post'
  })
}

export function formatSystem() {
  return request({
    url: '/format',
    method: 'post'
  })
}
