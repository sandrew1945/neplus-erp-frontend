<!--
  说明：新增/修改用户信息组件。
  使用方法：引用组件，然后如下实用：

  <RoleForm
      :model.sync="showEditor"
      :invoke="'refreshList'"
      @refreshList="getList"
    />
  invoke中的方法名与后面@getSelected要一致，不指定则默认为getList，其中getList为父组件定义的方法
  multi表示是否支持多选

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
        <q-toolbar-title><b>请输入角色信息</b></q-toolbar-title>
        <q-btn
          flat
          round
          dense
          icon="close"
          v-close-popup
        />
      </q-toolbar>
      <q-card-section>
        <q-form
          ref="roleForm"
          @reset="reset"
          class="q-gutter-md"
        >
          <q-input
            outlined
            dense
            label="角色代码"
            v-model="roleInfo.roleCode"
            :readonly="operation === 'edit' ? true : false"
            debounce="2000"
            :rules="operation === 'edit' ? [] : [ roleCodeVal ]"
          />
          <q-input
            outlined
            dense
            label="角色名称"
            v-model="roleInfo.roleName"
            :rules="[ val => val && val.length > 0 || '请输入角色名称']"
          />
          <FixcodeSelect
            :fixcodetype="'2004'"
            v-model:model="roleInfo.roleType"
            :placeholder="'角色类型'"
            dense
            :rules="[ val => val !== '' || '请选择角色类型' ]"
          />
          <FixcodeSelect
            :fixcodetype="'1001'"
            v-model:model="roleInfo.roleStatus"
            :placeholder="'角色状态'"
            dense
            :rules="[ val => val !== '' || '请选择角色状态' ]"
          />
          <div>
            <q-btn
              v-if="operation === 'create'"
              label="Create"
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
      </q-card-section>
    </q-card>
  </StickDialog>
</template>

<script setup lang="ts">
import FixcodeSelect from 'src/components/FixcodeSelect/index.vue'
import StickDialog from 'src/components/Dialog/StickDialog.vue'
import { createRole, updateRoleInfo, roleValidate } from 'src/api/rolemanager'
import { successNotify, warningNotify } from 'src/utils/Notify'
import { computed, ref, nextTick } from 'vue';

const props = defineProps({
  model: {
    required: true,
    type: Boolean
  },
  invoke: {
    required: true,
    type: String,
    default: 'getList'
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

const roleInfo = defineModel('roleInfo')

const emit = defineEmits(['update:model', 'refreshList'])
const showDialog = computed({
  get() {
    return props.model
  },
  set(val) {
    emit('update:model', val)
  }
})

const roleForm = ref(null)
const handleCreate = () => {
    roleForm.value.validate().then(success => {
    if (success) {
      createRole(roleInfo.value).then(() => {
        successNotify('Created Successfully')
        nextTick(() => {
         props.reset()
         showDialog.value = false
         emit(props.invoke)
        })
      })
    } else {
      warningNotify('请完善角色信息')
    }
  })
}
const handleUpdate = () => {
  roleForm.value.validate().then(success => {
    if (success) {
      updateRoleInfo(roleInfo.value).then(() => {
        successNotify('Update Successfully')
        nextTick(() => {
          props.reset()
          showDialog.value = false
          emit(props.invoke)
        })
      })
    } else {
      warningNotify('请完善角色信息')
    }
  })
}
const roleCodeVal = (val) => {
  if (val === '') {
    return '请输入用户代码'
  } else {
    return new Promise((resolve) => {
      roleValidate(val).then(res => {
        if (res.result === true && res.data === false) {
          resolve('角色代码已经存在')
        } else {
          resolve(true)
        }
      })
    })
  }
}
</script>
