import { request } from 'boot/axios'

/**
 *  Paginated query the tasks list
 * @param {*} queryParams
 */
export function getTaskList (data) {
  return request({
    url: 'taskmanager/taskManagerPageQuery',
    method: 'post',
    data
  })
}

export function fetchTaskInfo (taskId) {
  return request({
    url: 'taskmanager/getTaskInfoById',
    method: 'get',
    params: {'taskId': taskId}
  })
}

/**
 *  Delete the particular task by id
 * @param data
 * @returns {Promise<axios.AxiosResponse<any>>}
 */
export function deleteTask (data) {
  return request({
    url: 'taskmanager/deleteTaskById',
    method: 'post',
    data
  })
}

/**
 *  Upload the attachment and update the corresponding field in tm_task based on the attachmentType.
 * @param data
 * @returns {Promise<axios.AxiosResponse<any>>}
 */
export function uploadAttachment (data) {
  return request({
    url: 'taskmanager/uploadAttachment',
    method: 'post',
    headers: {
      'Content-Type': 'multipart'
    },
    data
  })
}

/**
 * Get the processes list of particular task
 * @param taskId
 * @returns {Promise<axios.AxiosResponse<any>>}
 */
export function fetchTaskProcessList (taskId) {
  return request({
    url: 'taskmanager/getTaskProcessList',
    method: 'get',
    params: {'taskId': taskId}
  })
}

/**
 *  Start the particular task process.
 * @param data
 * @returns {Promise<axios.AxiosResponse<any>>}
 */
export function makeTaskStart (data) {
  return request({
    url: 'taskmanager/makeTaskStart',
    method: 'post',
    data
  })
}

/**
 *  Self approved the particular task process.
 * @param data
 * @returns {Promise<axios.AxiosResponse<any>>}
 */
export function makeTaskSelfApproved (data) {
  return request({
    url: 'taskmanager/makeTaskSelfApproved',
    method: 'post',
    data
  })
}

/**
 *  Update the task's status to manager approved.
 * @param data
 * @returns {Promise<axios.AxiosResponse<any>>}
 */
export function makeTaskApproved (data) {
  return request({
    url: 'taskmanager/makeTaskApproved',
    method: 'post',
    data
  })
}

/**
 *  Update the task's status to manager rejection.
 * @param data
 * @returns {Promise<axios.AxiosResponse<any>>}
 */
export function makeTaskInnerReject (data) {
  return request({
    url: 'taskmanager/makeTaskInnerReject',
    method: 'post',
    data
  })
}

/**
 *  Update the task's status to draft sent
 * @param data
 * @returns {Promise<axios.AxiosResponse<any>>}
 */
export function makeTaskDraftSent (data) {
  return request({
    url: 'taskmanager/makeTaskDraftSent',
    method: 'post',
    data
  })
}
/**
 *  Update the task's status to client approved.
 * @param data
 * @returns {Promise<axios.AxiosResponse<any>>}
 */
export function makeClientApprove (data) {
  return request({
    url: 'taskmanager/makeClientApproved',
    method: 'post',
    data
  })
}
/**
 *  Update the task's status to client rejection.
 * @param data
 * @returns {Promise<axios.AxiosResponse<any>>}
 */
export function makeClientReject (data) {
  return request({
    url: 'taskmanager/makeClientReject',
    method: 'post',
    data
  })
}

/**
 * Update the task's status to declaration.
 * @param data
 * @returns {Promise<axios.AxiosResponse<any>>}
 */
export function makeTaskDeclaration (data) {
  return request({
    url: 'taskmanager/makeTaskDeclaration',
    method: 'post',
    data
  })
}
