import mockRequest from '@/utils/mockRequest'
const state = {
  list: []
}
const actions = {
  // 发请求获取首页的mock数据
  async getData(context) {
    const res = await mockRequest.get('/home/list')
    if (res.code === 20000) {
      context.commit('GETDATA', res.data)
    }
  }
}
const mutations = {
  GETDATA(state, list) {
    state.list = list
  }
}
const getters = {
  saleRank(state) {
    return state.list.saleRank
  },
  orderRank(state) {
    return state.list.orderRank
  },
  userRank(state) {
    return state.list.userRank
  }
}
export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters
}
