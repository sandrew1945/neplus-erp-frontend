<!--
  说明：新增/修改用户信息组件。
  使用方法：引用组件，然后如下实用：

  <MailTemplateForm
    v-model:model="showEditor"
    :operation="operation"
    v-model:mail-template-info="mailTemplateInfo"
    :reset="resetData"
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
    <q-card style="width: 900px;">
      <q-toolbar>
        <q-avatar>
          <img src="https://cdn.quasar.dev/logo/svg/quasar-logo.svg">
        </q-avatar>
        <q-toolbar-title><b>请输入邮件模版信息</b></q-toolbar-title>
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
          <div class="col-12">
            <q-form
              ref="templateForm"
              @reset="reset"
              class="q-gutter-md"
            >
              <q-input
                outlined
                dense
                v-model="mailTemplateInfo.templateName"
                label="模版名称"
                :rules="[ val => val && val.length > 0 || '请输入模版名称']"
              />
              <FixcodeSelect
                :fixcodetype="'1001'"
                v-model:model="mailTemplateInfo.templateStatus"
                :placeholder="'模版状态'"
                dense
                :rules="[ val => val !== '' || '请选择用户状态' ]"
              />
              <q-editor v-model="mailTemplateInfo.templateContent" min-height="20rem" />
              <div>
                <q-btn
                  v-if="operation === 'create'"
                  label="新建"
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
import { defineProps, defineEmits, computed, ref, nextTick } from 'vue';
import FixcodeSelect from 'src/components/FixcodeSelect/index.vue'
import StickDialog from 'src/components/Dialog/StickDialog.vue'
import { createMailTemplate, updateMailTemplate } from 'src/api/mailmanager';
import { successNotify, warningNotify } from 'src/utils/Notify';
// import { createUser, updateUserInfo, userValidate } from 'src/api/usermanager'
// import { successNotify, warningNotify } from 'src/utils/Notify'

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

const mailTemplateInfo = defineModel('mailTemplateInfo')

const emit = defineEmits(['update:model', 'refresh'])
const showDialog = computed({
  get() {
    return props.model
  },
  set(val) {
    emit('update:model', val)
  }
})

const templateForm = ref(null)
const handleCreate = () => {
  templateForm.value.validate().then(success => {
    if (success) {
      if (!mailTemplateInfo.value.templateContent)
      {
        warningNotify('请填写邮件模版')
        return
      }
      createMailTemplate(mailTemplateInfo.value).then(() => {
        successNotify('Created Successfully')
        nextTick(() => {
          props.reset()
          showDialog.value = false
          emit('refresh')
        })
      })
    } else {
      warningNotify('请完善邮件模版信息')
    }
  })
}
const handleUpdate = () => {
  templateForm.value.validate().then(success => {
    if (success) {
      if (!mailTemplateInfo.value.templateContent)
      {
        warningNotify('请填写邮件模版')
        return
      }
      updateMailTemplate(mailTemplateInfo.value).then(() => {
        successNotify('Update Successfully')
        nextTick(() => {
          props.reset()
          showDialog.value = false
          emit('refresh')
        })
      })
    } else {
      warningNotify('请完善邮件模版信息')
    }
  })
}

</script>
