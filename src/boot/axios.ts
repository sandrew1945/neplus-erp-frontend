import { boot } from 'quasar/wrappers';
import axios, { AxiosInstance } from 'axios';
import { useUserStore } from 'src/stores/user';
import { Loading, Platform } from 'quasar';
import { getToken } from 'src/utils/auth'
import qs from 'qs'
import { errorNotify } from 'src/utils/Notify'

declare module 'vue' {
  interface ComponentCustomProperties {
    $axios: AxiosInstance;
    $api: AxiosInstance;
  }
}

// Be careful when using SSR for cross-request state pollution
// due to creating a Singleton instance here;
// If any client changes this (global) instance, it might be a
// good idea to move this instance creation inside of the
// "export default () => {}" function below (which runs individually
// for each client)
const request = axios.create({
  baseURL: process.env.API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 100000 // request timeout
})
export default boot(async ({ app, router }) => {
  // for use inside Vue files (Options API) through this.$axios and this.$api

  app.config.globalProperties.$axios = axios;
  // ^ ^ ^ this will allow you to use this.$axios (for Vue Options API form)
  //       so you won't necessarily have to import axios in each vue file

  app.config.globalProperties.$api = request;
  // ^ ^ ^ this will allow you to use this.$api (for Vue Options API form)
  //       so you can easily perform requests against your app's API

  const store = useUserStore()
  request.interceptors.request.use((config) => {
    /** In dev, intercepts request and logs it into console for dev */
    Loading.show()
    const token = store.getToken || getToken()
    if (token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      config.headers!['X-Token'] = Platform.is.electron ? getToken() || store.getToken : getToken()
      config.headers!['sid'] = Platform.is.electron ? getToken() || store.getToken : getToken()
    }
    // fromdata提交
    // console.log(config.headers)
    // console.log('config.method =====>' + config.method)
    // console.log('config.contentType =====>' + config.headers['Content-Type'])
    // console.log(config.data)
    if (config.method === 'post' && config.headers!['Content-Type'] === 'multipart') {
      config.headers!['Content-Type'] = 'multipart/form-data'
    } else if (config.method === 'post' && config.headers!['Content-Type'] !== 'application/json') {
      config.data = qs.stringify(config.data)
    }
    return config
}, (error) => {
    console.log(error) // for debug
    return Promise.reject(error)
});

request.interceptors.response.use((response) => {
  Loading.hide()
  const res = response.data
  // if the custom code is not 20000, it is judged as an error.
  if (res.result === false || res.result === 0) {
    errorNotify(res.msg)
    return res
  } else {
    return res
  }
}, (error) => {

// errorNotify(error.message)
  if (error.response.status === 401) {
    // router.push({ path: '/login' })
    store.resetToken()
    store.setCode('')
    store.setRole('')
    store.setRoles([])
    // store.dispatch('user/resetToken')
    // store.dispatch('user/setCode', '')
    // store.dispatch('user/setRole', '')
    // store.dispatch('user/setRoles', [])
    router.push('/')
  }
  return Promise.reject(error)
});




});

export { request };
