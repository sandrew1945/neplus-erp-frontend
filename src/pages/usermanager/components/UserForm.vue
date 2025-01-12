<!--
  说明：新增/修改用户信息组件。
  使用方法：引用组件，然后如下实用：

  <UserForm
    v-model:model="showEditor"
    :operation="operation"
    v-model:user-info="userInfo"
    :reset="resetUser"
    @refresh="getList"
  />
  refresh中的方法名是用户新增或更新后回调方法，不指定则默认为getList，其中getList为父组件定义的方法

  getList: function(data) {
    console.log(JSON.stringify(data))
  }
-->

<template>
  <StickDialog
    v-model:model="showDialog"
    position="top"
  >
    <q-card style="width: 650px;">
      <q-toolbar>
        <q-avatar>
          <img src="https://cdn.quasar.dev/logo/svg/quasar-logo.svg">
        </q-avatar>
        <q-toolbar-title><b>请输入用户信息</b></q-toolbar-title>
        <q-btn
          flat
          round
          dense
          icon="close"
          v-close-popup
        />
      </q-toolbar>
      <q-card-section>
        <div class="row">
          <div class="col-md-4 col-xs-12 q-pb-lg">
            <AvatarUploader
              v-model:model="userInfo.avatar"
              :load-url="avatarUrl"
            />
          </div>
          <div class="col-md-8 col-xs-12">
            <q-form
              ref="userForm"
              @reset="reset"
              class="q-gutter-md"
            >
              <q-input
                outlined
                dense
                v-model="userInfo.userCode"
                label="用户账号"
                :readonly="operation === 'edit' ? true : false"
                debounce="2000"
                :rules="operation === 'edit' ? [] : [ userCodeVal ]"
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
<!--              <q-input-->
<!--                outlined-->
<!--                dense-->
<!--                v-model="userInfo.birthday"-->
<!--                type="date"-->
<!--                hint="生日"-->
<!--              />-->
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
                v-if="operation === 'create'"
                outlined
                dense
                v-model="userInfo.password"
                label="密码"
                type="password"
                :rules="[ val => val && val.length > 0 || '请输入密码']"
              />
              <q-input
                v-else
                outlined
                dense
                label="密码"
                type="password"
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
                  v-if="operation === 'create'"
                  label="Submit"
                  type="button"
                  color="primary"
                  @click="handleCreate"
                />
                <q-btn
                  v-else
                  label="Update"
                  type="button"
                  color="primary"
                  @click="handleUpdate"
                />
                <q-btn
                  label="Reset"
                  type="reset"
                  color="primary"
                  flat
                  class="q-ml-sm"
                />
              </div>
            </q-form>
          </div>
        </div>
      </q-card-section>
    </q-card>
  </StickDialog>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, computed, watch, ref, nextTick } from 'vue'
import FixcodeSelect from 'src/components/FixcodeSelect/index.vue'
import StickDialog from 'src/components/Dialog/StickDialog.vue'
import AvatarUploader from 'src/components/avatarUploader/index.vue'
import { createUser, updateUserInfo, userValidate } from 'src/api/usermanager'
import { successNotify, warningNotify } from 'src/utils/Notify'

const props = defineProps({
  model: {
    required: true,
    type: Boolean
  },
  operation: {
    required: true,
    type: String
  },
  reset: {
    required: true,
    type: Function,
    default: () => {}
  }
})

const avatarUrl = ref('')
const userInfo = defineModel('userInfo')

const emit = defineEmits(['update:model', 'refresh'])
const showDialog = computed({
  get() {
    return props.model
  },
  set(val) {
    emit('update:model', val)
  }
})


watch(showDialog, (newVal) => {
  if (newVal) {
    avatarUrl.value = process.env.API + 'generate/loadImage?filePath='
  }
})

const userForm = ref(null)
const handleCreate = () => {
  userForm.value.validate().then(success => {
    if (success) {
      createUser(userInfo.value).then(() => {
        successNotify('Created Successfully')
        nextTick(() => {
          props.reset()
          showDialog.value = false
          emit('refresh')
        })
      })
    } else {
      warningNotify('请完善用户信息')
    }
  })
}
const handleUpdate = () => {
  userForm.value.validate().then(success => {
    if (success) {
      updateUserInfo(userInfo.value).then(() => {
        successNotify('Update Successfully')
        nextTick(() => {
          props.reset()
          showDialog.value = false
          emit('refresh')
        })
      })
    } else {
      warningNotify('请完善用户信息')
    }
  })
}
const userCodeVal = (val) => {
  if (val === '') {
    return '请输入用户代码'
  } else {
    return new Promise((resolve) => {
      userValidate(val).then(res => {
        if (res.result === true && res.data === false) {
          resolve('用户代码已经存在')
        } else {
          resolve(true)
        }
      })
    })
  }
}
</script>
