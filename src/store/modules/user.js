import { login, register } from '../../api/user'
var state = {
  token: localStorage.getItem('token') || '',
  userType: localStorage.getItem('userType') || '',
  user: JSON.parse(localStorage.getItem('user')) || {}
  // 反序列化
}

// 暴露到仓库外的方法
var actions = {
  login({ commit }, params) {
    // Promis 是外面await asysn用的
    // resolve-成功 reject-失败
    return new Promise((resolve, reject) => {
      login(params).then((res) => {
        const token = res.headers['authorization']
        // commit('内部方法名',参数)
        commit('SET_TOKEN', token) // 需要存本地缓存才需要在store里面调用api，不然直接写vue页面那边就行了
        commit('SET_USER', res.data.data.userDto)
        resolve() // 有这个才会执行await后面的语句
      }).catch(() => {
        reject()
      })
    })
  },


  register({ commit }, params) {
    return new Promise((resolve, reject) => {
      register(params).then((res) => {
        const token = res.headers['authorization']
        commit('SET_TOKEN', token)
        commit('SET_USER', res.data.data.userDto)
        resolve()
      }).catch(() => {
        reject()
      })
    })
  }
}

var mutations = {
  SET_TOKEN(state, token) {
    state.token = token
    localStorage.setItem('token', token)
  },
  SET_USER(state, userDto) {
    state.user = userDto
    localStorage.setItem('userType', userDto.userType)
    localStorage.setItem('user', JSON.stringify(userDto))// 序列化：将对象转为字符串
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

