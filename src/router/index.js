import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/views/Login'
import TeacherIndex from '@/views/teacher/home/index'
import StudentIndex from '@/views/student/home/index'
import MyIndex from '@/views/my/index'
import { Toast } from 'vant'

Vue.use(Router)



export default new Router({
  routes: [
    {
      path: '/',
      name: 'login',
      beforeEnter: (to, from, next) => {
        if (localStorage.getItem('userType') === '1') {
          next('/teacher/index')
        } else if (localStorage.getItem('userType') === '2') {
          next('/student/index')
        } else {
          next('/login')
        }
      }
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('@/views/register')
    },
    {
      path: '/404',
      component: () => import('@/views/404')
    },
    // 下面是教师端
    {
      path: '/teacher/index',
      name: 'teacherIndex',
      component: TeacherIndex,
      beforeEnter: (to, from, next) => {
        if (localStorage.getItem('userType') !== '1') {
          Toast('无权限')
          next({ path: '/student/index' })
        } else {
          next()
        }
      }
    },
    {
      path: '/teacher/class',
      name: 'ClassIndex',
      component: () => import('@/views/teacher/class/index'),
      beforeEnter: (to, from, next) => {
        if (localStorage.getItem('userType') !== '1') {
          Toast('无权限')
          next({ path: '/student/index' })
        } else {
          next()
        }
      }
    },
    {
      path: '/teacher/student',
      name: 'StudentManager',
      component: () => import('@/views/teacher/student/index'),
      beforeEnter: (to, from, next) => {
        if (localStorage.getItem('userType') !== '1') {
          Toast('无权限')
          next({ path: '/student/index' })
        } else {
          next()
        }
      }
    },
    {
      path: '/teacher/task',
      name: 'TaskManager',
      component: () => import('@/views/teacher/task/index'),
      beforeEnter: (to, from, next) => {
        if (localStorage.getItem('userType') !== '1') {
          Toast('无权限')
          next({ path: '/student/index' })
        } else {
          next()
        }
      }
    },
    {
      path: '/teacher/taskDetail/:id',
      name: 'TaskDetail',
      component: () => import('@/views/teacher/task/detail'),
      beforeEnter: (to, from, next) => {
        if (localStorage.getItem('userType') !== '1') {
          Toast('无权限')
          next({ path: '/student/index' })
        } else {
          next()
        }
      }
    },
    // 下面是学生端的东西
    {
      path: '/student/index',
      name: 'studentIndex',
      component: StudentIndex
    },
    {
      path: '/student/task',
      name: 'TaskList',
      component: () => import('@/views/student/task/index'),
      beforeEnter: (to, from, next) => {
        if (localStorage.getItem('userType') !== '2') {
          Toast('无权限')
          next({ path: '/login' })
        } else {
          next()
        }
      }
    },
    // 下面是共有的
    {
      path: '/my/index',
      name: 'MyIndex',
      component: MyIndex
    },
    {
      path: '/resource/index',
      name: 'ResourceIndex',
      component: () => import('@/views/resource')
    },
    {
      path: '/discuss/index',
      name: 'DiscussIndex',
      component: () => import('@/views/discuss')
    },
    {
      path: '/daily/index',
      name: 'DailyIndex',
      component: () => import('@/views/daily')
    },
    {
      path: '/video/index',
      name: 'VideoIndex',
      component: () => import('@/views/video')
    },
    // 404的这个部分必须放最后！
    {
      path: '*',
      redirect: '/404' // 重定向到/404
    }
  ]
})
