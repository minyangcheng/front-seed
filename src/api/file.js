import request from '@/utils/request'
import axios from 'axios'

export function uploadFileOnStore(fileObj) {
  const param = new FormData()
  param.append('file', fileObj.file)
  Object.keys(fileObj.data).forEach(item => {
    param.append(item, fileObj.data[item])
  })
  return request({
    url: '/store/upload',
    method: 'post',
    timeout: 30000,
    headers: { 'Content-Type': 'multipart/form-data' },
    data: param
  })
}

export function uploadFileOnSystem(fileObj) {
  const param = new FormData()
  param.append('file', fileObj.file)
  Object.keys(fileObj.data).forEach(item => {
    param.append(item, fileObj.data[item])
  })
  return request({
    url: '/system/upload',
    method: 'post',
    timeout: 30000,
    headers: { 'Content-Type': 'multipart/form-data' },
    data: param
  })
}

export function downloadStoreFile() {
  axios({
    url: 'api/store/download',
    method: 'GET',
    responseType: 'blob',
    timeout: 30000
  }).then((response) => {
    const url = window.URL.createObjectURL(new Blob([response.data]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', Date.now() + '_file.xlsx')
    document.body.appendChild(link)
    link.click()
  })
}
