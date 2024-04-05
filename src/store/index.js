import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
import cka from './modules/cka.js'
import ckb from './modules/ckb.js'
import user from './modules/user.js'
import setting from './modules/setting.js'

export default new Vuex.Store({
  modules: {
    cka,
    ckb,
    user,
    setting
  }
})
