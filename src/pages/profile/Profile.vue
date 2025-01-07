<template>
  <q-page :class="$q.dark.isActive ? 'column bg-dark' : 'column bg-white'">
    <div
      class="col-10 q-ma-lg"
    >
      <div class="row justify-center">
        <div class="col-md-2 col-xs-12">
          <AvatarUploader
            v-model:model="userInfo.avatar"
            :load-url="avatarUrl"
          />
        </div>
        <div class="col-md-6 col-xs-12">
          <q-form
            ref="userForm"
            class="q-gutter-md"
          >
            <q-input
              outlined
              dense
              v-model="userInfo.userCode"
              label="用户账号"
              readonly
              debounce="2000"
            />
            <q-input
              outlined
              dense
              v-model="userInfo.userName"
              label="用户姓名"
              :rules="[ val => val && val.length > 0 || '请输入姓名']"
            />
            <FixcodeSelect
              :fixcodetype="'1002'"
              v-model:model="userInfo.sex"
              :placeholder="'性别'"
              dense
              :rules="[ val => val !== '' || '请选择用户性别' ]"
            />
<!--            <q-input-->
<!--              outlined-->
<!--              dense-->
<!--              v-model="userInfo.birthday"-->
<!--              type="date"-->
<!--              hint="生日"-->
<!--            />-->
            <q-input filled :model-value="`${userInfo.birthday ? userInfo.birthday : 'dd-mm-yyyy'}`" dense readonly>
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                    <q-date v-model="userInfo.birthday" mask="DD-MM-YYYY">
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="Close" color="primary" flat />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
            <q-input
              outlined
              dense
              label="密码"
              type="password"
              v-model="userInfo.password"
            />
            <FixcodeSelect
              :fixcodetype="'2001'"
              v-model:model="userInfo.userStatus"
              :placeholder="'用户状态'"
              dense
              :rules="[ val => val !== '' || '请选择用户状态' ]"
            />
            <q-input
              outlined
              dense
              v-model="userInfo.phone"
              label="电话"
            />
            <q-input
              outlined
              dense
              v-model="userInfo.mobile"
              label="手机"
            />
            <q-input
              outlined
              dense
              v-model="userInfo.email"
              label="电子邮件"
            />
            <div>
              <q-btn
                label="Update"
                type="button"
                color="primary"
                @click="handleUpdate"
              />
            </div>
          </q-form>
        </div>
      </div>
    </div>

  </q-page>
</template>
<script setup lang="ts">
import { ref, onBeforeMount, nextTick } from 'vue';
import FixcodeSelect from 'src/components/FixcodeSelect/index.vue'
import AvatarUploader from 'src/components/avatarUploader/index.vue'
import { fetchUserInfo, updateUserInfo } from 'src/api/usermanager';
import { successNotify, warningNotify } from 'src/utils/Notify'
import { date } from 'quasar';
import { useUserStore } from 'stores/user';
import { UserInfo } from 'src/models/usermanager-model';

const avatarUrl = ref('')
avatarUrl.value = process.env.API + 'generate/loadImage?filePath='
const userInfo = ref<UserInfo>({
  userId: '',
  userCode: '',
  userName: '',
  password: '',
  phone: '',
  mobile: '',
  email: '',
  sex: '',
  birthday: '',
  avatar: '',
  userStatus: ''
})

const store = useUserStore()
onBeforeMount(async () => {
  await fetchUserInfo(store.id).then((res) => {
    let birthday = ''
    if (res.data.birthday) {
      // const extractBirthday = date.extractDate(res.data.birthday, 'YYYY-MM-DD HH:mm:ss')
      birthday = date.formatDate(res.data.birthday, 'DD-MM-YYYY')
    }
    userInfo.value.userId = res.data.userId
    userInfo.value.userCode = res.data.userCode
    userInfo.value.userName = res.data.userName
    userInfo.value.phone = res.data.phone
    userInfo.value.mobile = res.data.mobile
    userInfo.value.email = res.data.email
    userInfo.value.sex = '' + res.data.sex
    userInfo.value.birthday = birthday
    userInfo.value.avatar = res.data.avatar
    userInfo.value.userStatus = '' + res.data.userStatus
  })
})

const userForm = ref(null)
const handleUpdate = () => {
  userForm.value.validate().then(success => {
    if (success) {
      updateUserInfo(userInfo.value).then(() => {
        successNotify('Update Successfully')
        nextTick(() => {
          userInfo.value.password = ''
        })
      })
    } else {
      warningNotify('请完善用户信息')
    }
  })
}
// const userCodeVal = (val) => {
//   if (val === '') {
//     return '请输入用户代码'
//   } else {
//     return new Promise((resolve) => {
//       userValidate(val).then(res => {
//         if (res.result === true && res.data === false) {
//           resolve('用户代码已经存在')
//         } else {
//           resolve(true)
//         }
//       })
//     })
//   }
// }
</script>
