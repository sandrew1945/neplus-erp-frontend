export function notNullRule (val) {
  if (val !== null && val !== '') {
    return true
  } else {
    return '不可为空,请正确输入'
  }
}
