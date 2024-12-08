import { request } from 'boot/axios'

export function doLogin (data) {
  return request({
    url: 'login',
    method: 'post',
    data
  })
}

export function getUserInfo (token) {
  return request({
    url: 'userInfo',
    method: 'get',
    params: { token }
  })
}

export function setUserRoleInfo(data) {
  return request({
    url: 'setCurrentlyRole',
    method: 'post',
    data
  })
}

export function getMenuByRole (param) {
  return request({
    url: 'getMenuByRole',
    method: 'get',
    params: { roleId: param }
  })
}

export function doLogout () {
  return request({
    url: 'logout',
    method: 'post'
  })
}
