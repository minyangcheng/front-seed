import Mock from 'mockjs'

export default [
  {
    url: '/store/list',
    type: 'post',
    response: config => {
      let mockData = Mock.mock({
        'list|25': [
          {
            'id|+1': 1,
            channelsName: '@first',
            storeName: '@cname',
            address: '花园',
            provincesName: '@province',
            cityName: '@city',
            areaName: '@county',
            lng: 120.212997,
            lat: 30.29133,
            dealerId: 1,
            dealerName: '@cname',
            'proxyCategory|1': ['1大卖场', '2精品超市', '3便利店', '4化妆品店', '5母婴店', '6美容院', '7标超'],
            'storeCategory|1': ['1KA', '2A', '3B'],
            storePhone: /^1[0-9]{10}$/,
            'storeNumber|1-20': 1,
            businessArea: '@float(60, 100)',
            price: '@float(60, 100)',
            monthlySales: '@float(60, 100)',
            remarks: '@csentence(3, 5)',
            arrivalTime: Date.now(),
            uptTime: Date.now()
          }
        ]
      })

      mockData.list.forEach((item, index) => {
        item.storeName = item.storeName + '店铺'
        item.dealerName = item.dealerName + '代理商公司'
        item.lng = item.lng + (index * 0.005) + ''
        item.lat = item.lat + (index * 0.005) + ''
        if (index != 2) {
          delete item.dealerId
        }
      })

      return { code: 200, data: { pages: 3, list: mockData.list }, message: 'success' }
    }
  },
  {
    url: '/dealer/list',
    type: 'post',
    response: config => {
      let mockData = Mock.mock({
        'list|25': [
          {
            'id|+1': 1,
            dealerName: '@cname',
            address: '花园',
            provincesName: '@province',
            cityName: '@city',
            areaName: '@county',
            'dealerCategory|1': ['1A', '2B', '3C', '4D'],
            dealerPhone: /^1[0-9]{10}$/,
            uptTime: Date.now()
          }
        ]
      })

      mockData.list.forEach((item, index) => {
        item.dealerName = item.dealerName + '代理商公司'
      })

      return { code: 200, data: { pages: 3, list: mockData.list }, message: 'success' }
    }
  },
  {
    url: '/notice/getNotice',
    type: 'post',
    response: config => {
      let mockData = Mock.mock({
        'count|+1': 406,
        newStoreName: '@cname'
      })
      mockData.newStoreName = mockData.newStoreName + '店铺'
      return { code: 200, data: mockData, message: 'success' }
    }
  }
]
