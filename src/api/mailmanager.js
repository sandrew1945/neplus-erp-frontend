import { request } from 'boot/axios'

/**
 *  Paginated query mail template list.
 * @param {*} queryParams
 */
export function getMailTemplateList (data) {
  return request({
    url: 'mailmanager/mailTemplatePageQuery',
    method: 'post',
    data
  })
}

/**
 *  Create new mail template
 * @param data
 * @returns {Promise<axios.AxiosResponse<any>>}
 */
export function createMailTemplate (data) {
  return request({
    url: 'mailmanager/createMailTemplate',
    method: 'post',
    data
  })
}

/**
 *  Fetch mail template information by id
 * @param templateId
 * @returns {Promise<axios.AxiosResponse<any>>}
 */
export function fetchMailTemplate (templateId) {
  return request({
    url: 'mailmanager/getMailTemplateById',
    method: 'get',
    params: {'templateId': templateId}
  })
}

/**
 *  Update specific mail template information by id
 * @param data
 * @returns {Promise<axios.AxiosResponse<any>>}
 */
export function updateMailTemplate (data) {
  return request({
    url: 'mailmanager/updateMailTemplate',
    method: 'post',
    data
  })
}

/**
 *  Delete specific mail template information by id
 * @param data
 * @returns {Promise<axios.AxiosResponse<any>>}
 */
export function deleteMailTemplate (data) {
  return request({
    url: 'mailmanager/deleteMailTemplate',
    method: 'post',
    data
  })
}

export function getAllMailTemplates () {
  return request({
    url: 'mailmanager/getAllMailTemplate',
    method: 'get'
  })
}
