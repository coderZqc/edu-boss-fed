import request from '@/utils/request'

export const getMenus = () => {
  return request({
    url: '/menus',
    method: 'GET'
  })
}

export const getMenuById = (id) => {
  return request({
    url: `/menus/${id}`,
    method: 'GET'
  })
}