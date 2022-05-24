import * as userApi from '@/api/user'
import * as menuApi from '@/api/menu'
import * as routeApi from '@/api/route'
import { resetRouter } from '@/router'

function getUserAttrFromLocalStorage(attr) {
  const user = JSON.parse(window.localStorage.getItem('user'))
  return user ? user[attr] : null
}

const state = {
  // persistent token
  get accessToken() {
    return getUserAttrFromLocalStorage('accessToken')
  },
  get refreshToken() {
    return getUserAttrFromLocalStorage('refreshToken')
  },
  set token(value) {
    if (value) {
      window.localStorage.setItem("user", JSON.stringify(value))
    } else {
      window.localStorage.removeItem('user')
    }
    return true
  },

  // user info
  introduction: null,
  username: null,
  avatar: null,

  // user permisssion
  roles: [],
  menus: [],
  routes: [],
}

const mutations = {
  SET_TOKEN(state, token) {
    state.token = token
  },
  SET_INTRODUCTION(state, introduction) {
    state.introduction = introduction
  },
  SET_USERNAME(state, username) {
    state.username = username
  },
  SET_AVATAR(state, avatar) {
    state.avatar = avatar
  },
  SET_ROLES(state, roles) {
    state.roles = roles
  },
  SET_MENUS(state, menus) {
    state.menus = menus
  },
  SET_ROUTES(state, routes) {
    state.routes = routes
  }
}

const actions = {

  async login({ commit }, loginParam) {
    const res = await userApi.login(loginParam)
    if (res.status === 200) {
      commit('SET_TOKEN', res.data)
      return
    }
    throw res
  },

  logout({ commit }) {
    commit('SET_TOKEN', null)
    commit('SET_INTRODUCTION', null)
    commit('SET_USERNAME', null)
    commit('SET_AVATAR', null)
    commit('SET_ROLES', [])
    commit('SET_MENUS', [])
    commit('SET_ROUTES', [])
    resetRouter()
  },

  async getInfo({ commit }) {
    console.log('before get user info')
    const res = await userApi.getUserInfo()
    console.log('after get user info', res)
    if (res.status === 200) {
      const { introduction, username, avatar, roles } = res.data
      commit('SET_INTRODUCTION', introduction)
      commit('SET_USERNAME', username)
      commit('SET_AVATAR', avatar)
      commit('SET_ROLES', roles)
    }
  },

  async initMenus({ commit }) {
    const res = await menuApi.getMenus()
    const { data: menus } = res
    const { roles } = state
    const filteredMenus = filterPermittedMenusFrom(menus)
    commit('SET_MENUS', filteredMenus)

    function filterPermittedMenusFrom(menus) {
      const res = []
      for (let menu of menus) {
        if (hasPermission(menu)) {
          const newMenu = { ...menu }
          newMenu.children = filterPermittedMenusFrom(newMenu.children)
          res.push(newMenu)
        }
      }
      return res
    }

    function hasPermission(menu) {
      return menu.roles && menu.roles.some(x => roles.includes(x))
    }
  },

  async initRoutes({ commit }) {
    const res = await routeApi.getRoutes()
    const { data: routes } = res
    const { roles } = state
    const filteredRoutes = filterPermittedRoutesFrom(routes)
    commit('SET_ROUTES', filteredRoutes)

    function filterPermittedRoutesFrom(routes) {
      const res = []
      for (let route of routes) {
        if (hasPermission(route)) {
          const newRoute = { ...route }
          newRoute.component = loadCpn(newRoute.component)
          newRoute.children = filterPermittedRoutesFrom(newRoute.children)
          res.push(newRoute)
        }
      }
      return res
    }

    function hasPermission({ meta }) {
      return meta.isPublic || meta.roles.some(x => roles.includes(x))
    }

    function loadCpn(componentPath) {
      if (componentPath.startsWith('@/views/')) {
        return (resolve) => require([`@/views/${componentPath.substring(8)}.vue`], resolve)
      }
      if (componentPath.startsWith('@/layout/')) {
        return (resolve) => require([`@/layout/${componentPath.substring(9)}.vue`], resolve)
      }
      console.log('@@@ loadCpn Error')
    }

  }

}



export default {
  namespaced: true,
  state,
  mutations,
  actions
}