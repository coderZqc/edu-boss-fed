import axios from 'axios'
import router from '@/router'
import store from '@/store'
import qs from 'qs'
import { Message } from 'element-ui'


axios.defaults.baseURL = 'http://localhost:3000/api/v1'

/*
 * HTTP 请求的 Content-Type 会根据 data 对象自动转换：
 * 如果 data 是普通对象，则 Content-Type 为 application/json
 * 如果 data 是查询字符串，则 Content-Type 为 x-www=form-urlencoded
 * 如果 data 是 FormData 对象，则 Content-Type 为 multipart/form-data
 */
const service = axios.create({})


/**
 * HTTP 请求拦截器：在请求头中设置 token
 * 如果 Vuex 中包含用户的个人信息，就在请求头中加入 token 字段。
 */
service.interceptors.request.use(function (config) {
  const accessToken = store.state.user.accessToken
  if (accessToken) {
    config.headers.Authorization = 'Bearer ' + accessToken
  }
  return config
})



function redirectLogin() {
  const query = { redirect: router.currentRoute.fullPath }
  if (query.redirect === '/login') {
    delete query.redirect
  }
  router.push({
    name: 'login',
    query
  })
}

/**
 * HTTP 响应拦截器：刷新 token
 * 以下两种情况会导致 token 的校验失败：
 * - token 在后端验签失败。这表明 token 是伪造的，或者 token 被篡改。
 * - token 过期，即 token 的有效期已过，必须为当前用户重新生成 token 。
 * ----------------------------------------------------------------------
 * 当 token 校验失败时，如果 Vuex 中包含 refresh_token ，则向服务端获取新的 token 。
 * 若 token 刷新成功，则把本次失败的请求重新发送出去，否则跳转到登录页。
 * 其他情况下，直接跳转到登录页。
 */
const responseHandler = {
  onsuccess: res => {
    return res
  },
  onerror: err => {
    if (err.response) {
      Message.info('Token 失效，已重试刷新')
      return _handleResponse(err.response)
    }
    if (err.request) {
      Message.error('请求超时，请刷新重试')
    } else {
      Message.error('请求发送失败' + err.message)
    }
    return Promise.reject(err)
  },
}

async function _handleResponse(res) {
  const { status } = res
  if (status === 401) {
    const retryRes = await _newRefreshTokenRequest(store.state.user.refreshToken)
    store.commit('user/SET_TOKEN', retryRes.data)
    res.config.headers.Authorization = 'Bearer ' + store.state.user.accessToken
    return await axios.create()(res.config)

    function _newRefreshTokenRequest(refreshToken) {
      return axios.create()({
        url: '/users/refresh',
        method: 'POST',
        data: qs.stringify({
          refreshToken
        })
      })
    }
  }

  if (status === 403) {
    // handle 403
    return console.log('handle 403')

  }

  if (status === 404) {
    // handle 404
    return console.log('handle 404')
  }

  return Promise.reject('@@@ not handle error status')


}

service.interceptors.response.use(
  responseHandler.onsuccess, 
  responseHandler.onerror)


export default service
