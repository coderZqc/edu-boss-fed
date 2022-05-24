import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store'


Vue.use(VueRouter)

const constantRoutes = [
  {
    name: 'login',
    path: '/login',
    component: () => import('@/views/login/index.vue'),
    meta: {
      isPublic: true,
      roles: []
    }
  },
]

const fallbackRoutes = [
  {
    name: '404',
    path: '*',
    component: () => import('@/views/error/404.vue'),
    meta: {
      isPublic: true,
      roles: []
    }
  }
]

const router = new VueRouter({
  routes: constantRoutes
})

// 路由前置守卫：
// 1. 如果目标路由需要验证，则先验证用户身份信息。
//  1.1 如果用户身份信息校验通过，则直接跳转至目标路由；
//  1.2 否则，跳转至登录页面进行登录，登录成功后再跳转至目标路由
// 2. 否则，直接放行。

router.beforeEach(async (to, from, next) => {

  // 判定是否登录的依据：Vuex 中是否存在 roles
  // Vuex 容器中 accessToken 和 refreshToken 的初始值是读取自浏览器 local storage 中的值， token 值可以伪造
  // Vuex 容器中 roles 的值，只能是在登录后，客户端携带 token 请求服务端获取得到，刷新浏览器后 Vuex 中的值将被恢复为初始值，这就需要再重新请求服务端设置 Vuex 中的 state 。除了 roles 外， Vuex 容器中的其他值如 menus , routes 也是如此
  const hasRoles = store.state.user.roles.length !== 0
  if (to.path === '/login') {
    console.log('to -> login')
    return hasRoles ? next({ path: '/' }) : next()
  }
  const noToken = store.state.user.accessToken === null
  if (noToken) {
    console.log('no token -> login')
    return next({
      name: 'login',
      // TODO redirect
    })
  }
  if (hasRoles) {
    console.log('hasRoles -> next')
    return next()
  }
  console.log('ready to fecth data...')
  try {
    await store.dispatch('user/getInfo')
    await store.dispatch('user/initMenus')
    await store.dispatch('user/initRoutes')
  
    let routes = store.state.user.routes
    routes = routes.concat(fallbackRoutes)
    store.commit('user/SET_ROUTES', routes)
    router.addRoutes(routes)
    console.log('mounted routes -> next')
    next({ ...to, replace: true })
  } catch (err) {
    console.log(err)
    next({ name: 'login' })
  }
})

export function resetRouter() {
  const newRouter = new VueRouter({
    routes: constantRoutes
  })
  router.matcher = newRouter.matcher // reset router
}

export default router
