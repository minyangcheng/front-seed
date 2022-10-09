import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'

const state = {
  token: getToken(),
  name: '',
  avatar: '',
  roles: [],
  userInfo: {}
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  SET_USER_INFO: (state, userInfo) => {
    state.userInfo = userInfo
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password }).then(response => {
        const { data } = response
        commit('SET_TOKEN', data)
        setToken(data)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo().then(response => {
        let { data } = response
        if (!data) {
          reject('数据出错，请重新登录')
        }
        data.avatar = 'https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=3091443174,2723539724&fm=26&gp=0.jpg'
        if (data.roles && !Array.isArray(data.roles)) {
          data.roles = [data.roles]
        }
        // roles must be a non-empty array
        if (!data.roles || data.roles.length <= 0) {
          reject('没有权限，请重新登录')
        }
        commit('SET_ROLES', data.roles)
        commit('SET_NAME', data.realName)
        commit('SET_AVATAR', data.avatar)
        commit('SET_USER_INFO', data)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        commit('SET_TOKEN', '')
        commit('SET_ROLES', [])
        commit('SET_USER_INFO', {})
        removeToken()
        resetRouter()
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      commit('SET_USER_INFO', {})
      removeToken()
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

