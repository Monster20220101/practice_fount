var state = {
  bbb: 222
}

var actions = {
  bbbAdd(context, params) {
    setTimeout(() => {
      context.commit('BBB_ADD', params)
    }, 3000)
  }
}

var mutations = {
  BBB_ADD(state, params) {
    state.bbb += params
  }
}

var getters = {
  bigBbb(state) {
    return state.bbb * 10
  }
}

export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters
}

