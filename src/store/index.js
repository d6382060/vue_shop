import { createStore } from 'vuex'
export default createStore({
  state: {
    user: {
      isLogin: window.sessionStorage.getItem('token') ? true : false
    }
  },
  mutations: {
    setIsLogin (state, payload) {
      state.user.isLogin = payload
    },
  },
  actions: {

  },
  modules: {
  }
})