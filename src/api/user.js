import request from '@/utils/request'
import qs from 'qs'


export const login = (loginParam) => {
  return request({
    url: '/users/login',
    method: 'POST',
    data: qs.stringify(loginParam)
  })
}

export const getUserInfo = () => {
  return request({
    url: '/users/info',
    method: 'GET'
  })
}

