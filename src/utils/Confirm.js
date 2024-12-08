import { Dialog } from 'quasar'

export function confirm (title, message, hook) {
  Dialog.create({
    title: title,
    message: message,
    cancel: true,
    persistent: true
  }).onOk(() => {
    hook()
  })
}
