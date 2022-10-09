import request from '@/utils/request'

export function getDealerList(dealerName = '', page = 0, size = 20, noLoading = false) {
  return request({
    url: '/dealer/list',
    method: 'post',
    headers: { 'no-loading': noLoading },
    data: {
      search: {
        dealerName
      },
      page,
      size
    }
  })
}
