import { defineStore } from 'pinia';
import { LoginForm } from 'src/models/login-model';
import { doLogin, getUserInfo, getMenuByRole, doLogout, setUserRoleInfo } from 'src/api/user';
import { setToken, removeToken, getToken } from 'src/utils/auth';
import { shallowRef } from 'vue';
import { RouteRecordRaw } from 'vue-router';

export const useUserStore = defineStore('user', {
  state: () => ({
    token: '' as string,
    name: '' as string,
    avatar: '' as string,
    id: '' as string,
    code: '' as string,
    sex: '' as string,
    roleId: '' as string,
    roleType: '' as string,
    roleName: '' as string,
    roleCode: '' as string,
    roles: [] as string[],
    menuList: shallowRef([]) as unknown as RouteRecordRaw[],
    counter: 0 as number
  }),

  getters: {
    getToken: (state) => state.token,
    getAvatar: (state) => state.avatar,
    getName: (state) => state.name,
    getId: (state) => state.id,
    getCode: (state) => state.code,
    getSex: (state) => state.sex,
    getRole: (state) => state.roleId,
    getRoleType: (state) => state.roleType,
    getRoles: (state) => state.roles,
    getMenuList: (state) => state.menuList
    // doubleCount (state) {
    //   return state.counter * 2;
    // }
  },

  actions: {
    login(userInfo: LoginForm) {
      const { username, password } = userInfo
      return new Promise((resolve, reject) => {
        doLogin({ userCode: username.trim(), password: password }).then(response => {
          const { data } = response
          // commit('SET_TOKEN', data.token)
          console.log('token =====>' + data.token)
          this.token = data.token
          setToken(data.token)
          resolve('')
        }).catch(error => {
          reject(error)
        })
      })
    },
    setName(name: string) {
      this.name = name
    },
    setRole(role: string) {
      return new Promise((resolve, reject) => {
        setUserRoleInfo({'roleId': role}).then(response => {
          const { data } = response
          if (!data) {
            reject('Failed to set user role information')
          }
          this.roleId = data.roleId
          this.roleType = data.roleType
          this.roleCode = data.roleCode
          this.roleName = data.roleName
          resolve(data)
        }).catch(error => {
          reject(error)
        })
      })
    },
    setRoles(roles: string[]) {
      this.roles = roles
    },
    setRoleType(roleType: string) {
      this.roleType = roleType
    },
    setCode(code: string) {
      this.code = code
    },
    getInfo() {
      return new Promise((resolve, reject) => {
        const token = this.getToken || getToken()
        getUserInfo(token).then(response => {
          const { data } = response
          if (!data) {
            reject('Verification failed, please Login again.')
          }
          const { userId, userCode, userName, sex, avatar, roleList } = data
          this.id = userId
          this.code = userCode
          this.name = userName
          this.sex = sex
          this.avatar = avatar
          this.roles = roleList
          // commit('SET_ID', userId)
          // commit('SET_CODE', userCode)
          // commit('SET_NAME', userName)
          // commit('SET_SEX', sex)
          // commit('SET_AVATAR', avatar)
          // commit('SET_ROLES', roleList)
          resolve(data)
        }).catch(error => {
          reject(error)
        })
      })
    },
    getMenu(roleId: string) {
      return new Promise((resolve) => {
        getMenuByRole(roleId).then(response => {
          const { data } = response
          // this.menuList = data
          resolve(data)
        })
      })
    },
    resetSelectedRole() {
      this.roleId = ''
    },
    logout() {
      return new Promise((resolve, reject) => {
        doLogout().then(() => {
          this.token = ''
          this.code = ''
          this.name = ''
          this.roleId = ''
          this.menuList = []
          this.roles = []
          this.avatar = ''
          removeToken()
          // resetRouter()
          resolve('')
        }).catch(error => {
          this.token = ''
          this.code = ''
          this.name = ''
          this.roleId = ''
          this.menuList = []
          this.roles = []
          this.avatar = ''
          removeToken()
          // resetRouter()
          // resolve()
          reject(error)
        })
      })
    },
    setMenu(menuList: RouteRecordRaw[]) {
      this.menuList = menuList
    },
    resetToken() {
      return new Promise(resolve => {
        // commit('SET_TOKEN', '')
        setToken('')
        removeToken()
        resolve('')
      })
    }
  }
});
