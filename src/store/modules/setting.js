var state = {
  tabbarActive: ''
}

var actions = {
  setRouter({ commit }, routers) {
    commit('SET_ROUTER', routers)
  }
}

var mutations = {
  SET_ROUTER(state, params) {
    state.tabbarActive = params
  }
}

var getters = {

}

export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters
}
