var state = {
  aaa: 111,
  userInfo: {
    name: 'xiaolin',
    age: 24
  }
}

var actions = {
  aaaAdd(context, params) {
    setTimeout(() => {
      context.commit('AAA_ADD', params)
    }, 3000)
  }
}

var mutations = {
  AAA_ADD(state, params) {
    state.aaa += params
  }
}

var getters = {
  bigAaa(state) {
    return state.aaa * 10
  }
}

export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters
}
