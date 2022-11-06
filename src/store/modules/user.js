import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import router, { resetRouter, asyncRoutes, constantRoutes, anyRoues } from '@/router'
import Router from 'vue-router'

const getDefaultState = () => {
  return {
    token: getToken(),
    // 用户名
    name: '',
    // 用户头像
    avatar: '',
    // 菜单权限标记
    routes: [],
    // 按钮权限标记
    buttons: [],
    // 角色
    roles: [],
    // 对比之后【项目中已有的异步路由，与服务器返回的标记信息对比最终需要展示的路由】
    resultAsyncRoutes: [],
    // 用户最终需要展示的全部路由
    resultAllRoutes: []
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
  // 存储用户信息
  SET_USERINFO(state, userInfo) {
    // 用户名
    state.name = userInfo.name
    // 用户头像
    state.avatar = userInfo.avatar
    // 菜单权限标记
    state.routes = userInfo.routes
    // 按钮权限标记
    state.buttons = userInfo.buttons
    // 角色
    state.roles = userInfo.roles
  },
  // 最终计算出异步路由
  SET_RESULTASYNCROUTES(state, asyncRoutes) {
    state.resultAsyncRoutes = asyncRoutes
    // 计算出当前用户需要展示的所有路由
    state.resultAllRoutes = constantRoutes.concat(state.resultAsyncRoutes, anyRoues)
    // 给路由添加新的路由
    // 添加路由之前，将之前的路由清除
    router.matcher = new Router().matcher
    router.addRoutes(state.resultAllRoutes)
  }
}

// 定义一个函数，两个数组进行对比，对比出当前用户到底应该展示哪些异步路由
// 形参：asyncRoutes：全部的异步路由, routes：当前登录用户的菜单权限
const computedAsyncRoutes = (asyncRoutes, routes) => {
  // 过滤出当前用户【超级管理|普通员工】需要展示的异步路由
  return asyncRoutes.filter(item => {
    if (routes.includes(item.name)) {
      // 递归，将children中该用户有的权限过滤出来
      if (item.children && item.children.length) {
        item.children = computedAsyncRoutes(item.children, routes)
      }
      return true
    }
  })
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
      // vuex存储用户全部信息
      commit('SET_USERINFO', data)
      commit('SET_RESULTASYNCROUTES', computedAsyncRoutes(asyncRoutes, data.routes))
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
