import Mock from 'mockjs'
import * as user from './user'
import * as route from './route'
import * as menu from './menu'

Mock.setup({
  timeout: '300-600'
})

Mock.mock('/user/login', 'post', user.login)
Mock.mock('/user/info', 'get', user.getUserInfo)
Mock.mock('/user/refresh', 'post', user.refreshToken)

Mock.mock('/menus', 'get', menu.getMenus)
Mock.mock(/\/menu\/\d+/, 'get', () => menu.getMenuById(1))
Mock.mock('/routes', 'get', route.getRoutes)