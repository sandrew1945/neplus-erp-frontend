import { request } from 'boot/axios'

/**
 *  查询用户列表
 * @param {*} queryParams
 */
export function getClientList (data) {
  return request({
    url: 'clientmanager/clientManagerPageQuery',
    method: 'post',
    data
  })
}

export function createClient (data) {
  return request({
    url: 'clientmanager/createClientInfo',
    method: 'post',
    data
  })
}

export function clientValidate (name) {
  return request({
    url: 'clientmanager/clientNameValidate',
    method: 'get',
    params: {'clientName': name}
  })
}

export function fetchClientInfo (clientId) {
  return request({
    url: 'clientmanager/getClientInfoById',
    method: 'get',
    params: {'clientId': clientId}
  })
}

export function updateClientInfo (data) {
  return request({
    url: 'clientmanager/updateClientInfo',
    method: 'post',
    data
  })
}

export function deleteClient (data) {
  return request({
    url: 'clientmanager/deleteClient',
    method: 'post',
    data
  })
}
