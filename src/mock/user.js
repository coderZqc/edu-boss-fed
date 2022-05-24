import Mock from 'mockjs'
import qs from 'qs'
import store from '@/store'
import jwt from 'jsonwebtoken'

const PRIVATE_KEY = 'private_key'

const users = require('@/mock/data/user.json')

export const login = (request) => {
  const userList = JSON.parse(JSON.stringify(users))
  const { username, password } = qs.parse(request.body)
  const user = userList.find(
    (user) => user.username === username && user.password === password)

  if (user) {
    const payload = {
      id: user.id,
      username: user.username,
      roles: user.roles
    }
    return Mock.mock({
      success: true,
      data: {
        accessToken: jwt.sign(payload, PRIVATE_KEY, { expiresIn: '5s' }),
        refreshToken: jwt.sign(payload, PRIVATE_KEY),
      }
    })
  }
  return Mock.mock({
    success: false,
    data: {
      message: '用户名或密码错误'
    }
  })
}

export const refreshToken = (request) => {
  try {
    const { refreshToken } = qs.parse(request.body)
    let payload = jwt.verify(refreshToken, PRIVATE_KEY)
    delete payload.iat
    return Mock.mock({
      success: true,
      data: {
        ...payload,
        accessToken: jwt.sign(payload, PRIVATE_KEY, { expiresIn: '5s' }),
        refreshToken: jwt.sign(payload, PRIVATE_KEY),
      }
    })
  } catch (err) {
    return Mock.mock({
      success: false,
      data: {
        message: '无效的 refresh_token'
      }
    })
  }

}

export const getUserInfo = () => {
  try {
    // TODO 应该从请求头的 Authorization 字段中获取 token 进行校验
    const user = jwt.verify(store.state.user.accessToken, PRIVATE_KEY)
    // TODO 应该从数据库中根据 user.userid 字段查询 userinfo 返回
    return Mock.mock({
      success: true,
      data: {
        userid: user.userid,
        username: user.username,
        introduction: Mock.mock('@sentence()'),
        avatar: Mock.Random.image('40x40'),
        roles: user.roles
      }
    })
  } catch (err) {
    return Mock.mock({
      success: false,
      data: {
        message: '无效的 access_token'
      }
    })
  }
}

