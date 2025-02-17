import { Cookies } from 'quasar'

const TokenKey = 'quasar_template_token'

export function getToken () {
  return Cookies.get(TokenKey)
}

export function setToken (token) {
  return Cookies.set(TokenKey, token, { expires: 10 })
}

export function removeToken () {
  return Cookies.remove(TokenKey)
}
