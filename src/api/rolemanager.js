import { request } from 'boot/axios'

/**
 *  查询角色列表
 * @param {*} queryParams
 */
export function getRoleList (data) {
  return request({
    url: 'rolemanager/roleManagerPageQuery',
    method: 'post',
    data
  })
}
/**
 *  创建角色
 * @param {*} roleInfo
 */
export function createRole (data) {
  return request({
    url: 'rolemanager/createRole',
    method: 'post',
    data
  })
}
/**
 *  查询角色信息
 * @param {*} id
 */
export function fetchRoleInfo (id) {
  return request({
    url: 'rolemanager/getRoleInfoById',
    method: 'get',
    params: { roleId: id }
  })
}
/**
 *  更新角色信息
 * @param {*} data
 */
export function updateRoleInfo (data) {
  return request({
    url: 'rolemanager/updateRole',
    method: 'post',
    data
  })
}
/**
 *  删除角色
 * @param {*} data
 */
export function deleteRole (data) {
  return request({
    url: 'rolemanager/deleteRole',
    method: 'post',
    data
  })
}

/**
 *  保存权限
 * @param {*} data
 */
export function saveSelectedFunc (data) {
  return request({
    url: 'rolemanager/saveSelectedFunc',
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    data
  })
}

/**
 *  获取已选菜单
 * @param {*} roleId
 */
export function getCheckedPremission (roleId) {
  return request({
    url: 'rolemanager/getCheckedPremission',
    method: 'get',
    params: { roleId: roleId }
  })
}

/**
 *  新增菜单
 * @param {*} data
 */
export function addMenuNode (data) {
  return request({
    url: 'rolemanager/addMenuNode',
    method: 'post',
    data
  })
}

/**
 *  角色代码验证
 * @param {*} roleCode
 */
export function roleValidate (roleCode) {
  return request({
    url: 'rolemanager/roleValidate',
    method: 'get',
    params: { roleCode: roleCode }
  })
}
