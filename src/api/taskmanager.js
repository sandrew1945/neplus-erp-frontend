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

