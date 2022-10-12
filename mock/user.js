import Mock from 'mockjs'

const users = {
  '17682315369-admin': {
    roles: 'admin',
    avatar: 'https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=3091443174,2723539724&fm=26&gp=0.jpg',
    username: '17682315369',
    realName: '冯宝宝',
    dealerId: 1,
    dealerName: '老大哥有限公司',
    sex: 1
  },
  '1525717-dealer': {
    roles: 'dealer',
    avatar: 'https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=3091443174,2723539724&fm=26&gp=0.jpg',
    username: '1525717',
    realName: '王也',
    dealerId: 2,
    dealerName: '八绝技有限公司',
    sex: 1
  }
}

export default [
  {
    url: '/login',
    type: 'post',
    response: config => {
      let { username, password } = config.body
      let token
      if (username == '17682315369' && password == '123456') {
        token = '17682315369-admin'
      } else if (username == '1525717' && password == '123456') {
        token = '1525717-dealer'
      }
      if (!token) {
        return { code: 400, message: '用户名密码不正确' }
      }
      return { code: 200, data: token, message: '登录成功' }
    }
  },
  {
    url: '/user/myinfo',
    type: 'post',
    response: config => {
      const info = users[config.headers['x-token']]
      if (!info) {
        return { code: 401, message: '无法获取用户信息，请重新登录' }
      }
      return { code: 200, data: info }
    }
  },
  {
    url: '/logout',
    type: 'post',
    response: config => {
      return { code: 200, data: '注销成功' }
    }
  },
  {
    url: '/user/list',
    type: 'post',
    response: config => {
      let mockData = Mock.mock({
        'list|20': [
          {
            'id|+1': 1,
            username: /^1[0-9]{10}$/,
            realName: '@cname',
            avatar: 'https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=3091443174,2723539724&fm=26&gp=0.jpg',
            'sex|1-2': 1,
            'roles|1': ['admin', 'dealer'],
            'dealerId|+1': 1,
            dealerName: '@cname',
            dealerCategory: 2,
            uptTime: '@datetime("yyyy-MM-dd HH:mm")'
          }
        ]
      })

      mockData.list.forEach((item, index) => {
        item.dealerName = item.dealerName + '代理商公司'
      })

      return { code: 200, data: { pages: 3,total:101,list: mockData.list}, message: 'success' }
    }
  }
]
