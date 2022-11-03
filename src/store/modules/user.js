import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'

const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    avatar: ''
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: state => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  }
}

const actions = {
  // 登录业务
  async login({ commit }, userInfo) {
    // 解构出用户名和密码
    const { username, password } = userInfo
    const res = await login({ username: username.trim(), password: password })
    // 注意：当前登录请求使用mock数据，mock数据成功的code是20000
    if (res.code === 20000) {
      commit('SET_TOKEN', res.data.token)
      setToken(res.data.token)
      return 'ok'
    } else {
      return Promise.reject(new Error('faile'))
    }
  },

  // get user info
  async getInfo({ commit, state }) {
    const res = await getInfo(state.token)
    if (res.code === 20000) {
      const { data } = res
      if (!data) {
        return Promise.reject(new Error('Verification failed, please Login again.'))
      }
      const { name, avatar } = data
      commit('SET_NAME', name)
      commit('SET_AVATAR', avatar)
      return 'ok'
    } else {
      return Promise.reject(new Error('faile'))
    }

    // return new Promise((resolve, reject) => {
    //   getInfo(state.token)
    //     .then(response => {
    //       const { data } = response
    //       if (!data) {
    //         return reject('Verification failed, please Login again.')
    //       }
    //       const { name, avatar } = data
    //       commit('SET_NAME', name)
    //       commit('SET_AVATAR', avatar)
    //       resolve(data)
    //     })
    //     .catch(error => {
    //       reject(error)
    //     })
    // })
  },

  // user logout
  async logout({ commit, state }) {
    const res = await logout(state.token)
    if (res.code === 20000) {
      removeToken() // must remove  token  first
      resetRouter()
      commit('RESET_STATE')
      return 'ok'
    } else {
      return Promise.reject(new Error('faile'))
    }

    // return new Promise((resolve, reject) => {
    //   logout(state.token)
    //     .then(() => {
    //       removeToken() // must remove  token  first
    //       resetRouter()
    //       commit('RESET_STATE')
    //       resolve()
    //     })
    //     .catch(error => {
    //       reject(error)
    //     })
    // })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
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
