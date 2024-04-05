import { Toast } from 'vant'
import router from './router'

router.beforeEach((to, from, next) => {
  if (localStorage.getItem('token') === null && to.path !== '/login' && to.path !== '/register') {
    console.log(123123, to)
    Toast('请登录')
    next('/login')
  } else {
    next()
  }
})
