// import * as routeApi from '@/api/route'

// const state = {
//   values: []
// }

// const mutations = {
//   SET_ROUTES(state, routes) {
//     state.values = routes
//   }
// }

// const actions = {
//   async init({ commit }, roles) {
//     const resp = await routeApi.getRoutes()
//     const { data: { data: { routes } } } = resp
//     console.log('store routes in resp', routes)

//     const filteredRoutes = roles.includes('admin') ? routes : dfs(routes, roles)
//     mountRouteCpn(filteredRoutes)
//     commit('SET_ROUTES', filteredRoutes)
//     console.log('store filteredRoutes', filteredRoutes)
//   }
// }

// function dfs(routes, roles) {
//   if (routes === undefined) {
//     return []
//   }
//   const res = []
//   for (let route of routes) {
//     const newRoute = { ...route }
//     if (hasPermission(roles, route)) {
//       newRoute.children = dfs(newRoute.children, roles)
//       res.push(newRoute)
//     }
//   }

//   return res
// }

// function hasPermission(roles, route) {
//   const { roles: permittedRoles, isPublic } = route.meta
//   if (isPublic || permittedRoles.length === 0) {
//     return true
//   }
//   return permittedRoles.some(x => roles.includes(x))
// }

// function mountRouteCpn(routeForest) {
//   if (routeForest && routeForest.length) {
//     for (let route of routeForest) {
//       route.component = loadCpn(route.component)
//       mountRouteCpn(route.children)
//     }
//   }
// }

// function loadCpn(componentPath) {
//   if (componentPath.startsWith('@views/')) {
//     return (resolve) => require([`@/views/${componentPath.substring(7)}.vue`], resolve)
//   }
//   if (componentPath.startsWith('@layout/')) {
//     return (resolve) => require([`@/layout/${componentPath.substring(8)}.vue`], resolve)
//   }
//   console.log('@@@ loadCpn Error')
// }

// export default {
//   namespaced: true,
//   state,
//   mutations,
//   actions
// }