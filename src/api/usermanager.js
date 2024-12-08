import { request } from 'boot/axios'

/**
 *  查询用户列表
 * @param {*} queryParams
 */
export function getUserList (data) {
  return request({
    url: 'usermanager/userManagerPageQuery',
    method: 'post',
    data
  })
}
/**
 *  创建用户
 * @param {*} userInfo
 */
export function createUser (data) {
  return request({
    url: 'usermanager/createUserInfo',
    method: 'post',
    data
  })
}
/**
 *  查询用户信息
 * @param {*} id
 */
export function fetchUserInfo (id) {
  return request({
    url: 'usermanager/getUserInfoById',
    method: 'get',
    params: { userId: id }
  })
}
/**
 *  更新用户信息
 * @param {*} data
 */
export function updateUserInfo (data) {
  return request({
    url: 'usermanager/updateUserInfo',
    method: 'post',
    data
  })
}
/**
 *  删除用户
 * @param {*} data
 */
export function deleteUser (data) {
  return request({
    url: 'usermanager/deleteUserInfo',
    method: 'post',
    data
  })
}

export function queryRelationRoles (userId) {
  return request({
    url: 'usermanager/queryRelationRoles',
    method: 'get',
    params: { userId: userId }
  })
}

export function queryUnRelationRoles (data) {
  return request({
    url: 'usermanager/queryUnRelationRoles',
    method: 'post',
    data
  })
}

export function addRole (data) {
  return request({
    url: 'usermanager/createRelation',
    method: 'post',
    data
  })
}

export function deleteRole (data) {
  return request({
    url: 'usermanager/deleteRoleRelation',
    method: 'post',
    data
  })
}

/**
 *  Change personal password
 * @param {*} data
 */
export function updatePassword (data) {
  return request({
    url: 'usermanager/updatePassword',
    method: 'post',
    data
  })
}

/**
 *  Upload the user's photo.
 * @param {*} data
 */
export function uploadAvatar (data) {
  return request({
    url: 'generate/uploadImg',
    method: 'post',
    headers: {
      'Content-Type': 'multipart'
    },
    // contentType: 'multipart',
    data
  })
}

/**
 *  Validate whether the user code is repeated.
 * @param {*} userCode
 */
export function userValidate (userCode) {
  return request({
    url: 'usermanager/userValidate',
    method: 'get',
    params: { userCode: userCode }
  })
}

/**
 *  Get the users with a particular role type
 * @param roleType
 * @returns {Promise<axios.AxiosResponse<any>>}
 */
export function getUserListByRoleType(roleType) {
  return request({
    url: 'usermanager/getUserListByRoleType',
    method: 'get',
    params: { roleType: roleType }
  })
}

