// import something here

// "async" is optional;
// more info on params: https://quasar.dev/quasar-cli/boot-files
import { LoadingBar } from 'quasar'
import getPageTitle from 'src/utils/get-page-title'
import { getToken } from 'src/utils/auth' // get token from cookie
import { errorNotify } from 'src/utils/Notify'
import { useUserStore } from 'src/stores/user'


const whiteList = ['/login'] // no redirect whitelist

export default async ({ router }) => {
  const store = useUserStore();
  router.beforeEach(async (to) => {
    // start progress bar
    LoadingBar.start()
    // set page title
    document.title = getPageTitle(to.meta.title)
    // determine whether the user has logged in
    const hasToken = getToken() || store.getToken
    // console.log('hasToken ------>' + hasToken)
    if (hasToken) {
      if (to.path === '/login') {
        // if is logged in, redirect to the home page
        // next({ path: '/' })
        return '/'
        LoadingBar.stop()
      } else {
        const hasGetUserInfo = store.getName
        if (hasGetUserInfo) {
          // next()
          // return ''
          LoadingBar.stop()
        } else {
          try {
            // get user info
            await store.getInfo()
            if (store.getRoles.length > 1) {
              // next('/role')
              return '/role'
              LoadingBar.stop()
            } else if (store.getRoles.length === 1) {
              const roleId = store.getRoles['0'].roleId
              store.setRole(roleId).catch(error => console.error(error))
              // await store.getMenu(roleId)
              store.getMenu(roleId).then(response => {

                // const routers = rFormat(response)
                store.setMenu(response)
                if (to.path === '/') {
                  // next('/index/dashboard')
                  return '/index/dashboard'
                } else {
                  // next(to.path)
                  return to.path
                }
                LoadingBar.stop()
              })
            } else {
              // 跳转到无权限页面
              // next('/401')
              return '/401'
              LoadingBar.stop()
            }
          } catch (error) {
            // remove token and go to login page to re-login
            await store.resetToken()
            errorNotify(error)
            LoadingBar.stop()
            // next(`/login?redirect=${to.path}`)
            return `/login?redirect=${to.path}`
          }
        }
      }
    } else {
      /* has no token */
      LoadingBar.stop()
      if (whiteList.indexOf(to.path) !== -1) {
        // in the free login whitelist, go directly
        // LoadingBar.stop()
        // next()
        return true
      } else {
        store.setName('')
        // other pages that do not have permission to access are redirected to the login page.
        // LoadingBar.stop()
        // next(`/login?redirect=${to.path}`)
        return `/login?redirect=${to.path}`
      }
    }
  })

  router.afterEach(() => {
    // finish progress bar
    LoadingBar.stop()
  })
}
