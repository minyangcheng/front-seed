import axios from 'axios'

const qs = require('qs')
import { MessageBox, Message, Loading } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'

let loadingInstance

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  withCredentials: true, // send cookies when cross-domain requests
  timeout: 8000, // request timeout
  headers: { 'Content-Type': 'application/json' }
  // headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
})

// request interceptor
service.interceptors.request.use(config => {
    if (!config.headers.hasOwnProperty('no-loading') || !config.headers['no-loading']) {
      showLoading()
    }
    if (store.getters.token) {
      config.headers['Authorization'] = getToken()
    }
    if (config.headers['Content-Type'] == 'application/x-www-form-urlencoded') {
      config.data = qs.stringify(config.data)
    } else if (config.headers['Content-Type'] == 'application/json') {
      config.data = JSON.stringify(config.data)
    }

    return config
  }, error => {
    // do something with request error
    console.log(error) // for debug
    hideLoading()
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(response => {
    hideLoading()
    const res = response.data

    // if the custom code is not 20000, it is judged as an error.
    if (res.code !== 200) {
      Message({
        message: res.message || '服务器错误',
        type: 'error',
        duration: 5 * 1000
      })

      // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
      if (res.code === 401) {
        // to re-login
        MessageBox.confirm('登录失效，请重新登陆', '提示', {
          confirmButtonText: '登录',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          store.dispatch('user/resetToken').then(() => {
            location.reload()
          })
        })
      }
      return Promise.reject(new Error(res.message || '服务器错误'))
    } else {
      return res
    }
  },
  error => {
    hideLoading()
    console.log('err' + error) // for debug
    Message({
      message: '网络异常，请重试!',
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

function showLoading() {
  loadingInstance = Loading.service({ fullscreen: true, background: 'rgba(0, 0, 0, 0.1)', lock: true })
}

function hideLoading() {
  if (loadingInstance) {
    loadingInstance.close()
  }
}

export default service
