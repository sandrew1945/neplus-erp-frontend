import { Notify } from 'quasar'

export function successNotify (message) {
  Notify.create({
    type: 'positive',
    message: message || 'Success',
    position: 'top',
    closeBtn: true
  })
}

/**
 *  错误提示
 * @param {*} message
 */
export function errorNotify (message) {
  Notify.create({
    type: 'negative',
    message: message || 'Error',
    position: 'top',
    closeBtn: true
  })
}

/**
 *  信息提示
 * @param {*} message
 */
export function infoNotify (message) {
  Notify.create({
    type: 'success',
    message: message || 'Info',
    position: 'top',
    closeBtn: true
  })
}

/**
 *  警告提示
 * @param {*} message
 */
export function warningNotify (message) {
  Notify.create({
    type: 'warning',
    message: message || 'Warning',
    position: 'top',
    closeBtn: true
  })
}
