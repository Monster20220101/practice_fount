// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import store from './store'
import router from './router'
import Vant from 'vant'
import 'vant/lib/index.css'
import { Form } from 'vant'
import { Field } from 'vant'

// 左右滑动切换页面
import VueTouch from 'vue-touch'
Vue.use(VueTouch, { name: 'v-touch' })
VueTouch.config.swipe = {
  threshold: 50 // 设置左右滑动的距离
}


Vue.use(Form)
Vue.use(Field)

import axios from 'axios'
Vue.prototype.$axios = axios
import './premision'

Vue.config.productionTip = false
Vue.use(Vant)

// 配置进度条
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
NProgress.configure({
  easing: 'ease', // 动画方式
  speed: 500, // 递增进度条的速度
  showSpinner: false, // 是否显示加载ico
  trickleSpeed: 200, // 自动递增间隔
  minimum: 0.3 // 初始化时的最小百分比
})
// 当路由进入前
router.beforeEach((to, from, next) => {
  // 每次切换页面时，调用进度条
  NProgress.start()
  // 若加载时间长且不定，担心进度条走完都没有加载完，可以调用
  NProgress.inc() // 这会以随机数量递增，且永远达不到100%，也可以设指定增量
  next()
})
// 当路由进入后：关闭进度条
router.afterEach(() => {
  // 在即将进入新的页面组件前，关闭掉进度条
  NProgress.done()
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App),
  store
})


