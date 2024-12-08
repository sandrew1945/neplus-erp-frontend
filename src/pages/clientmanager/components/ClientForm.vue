<!--
  说明：新增/修改用户信息组件。
  使用方法：引用组件，然后如下实用：

  <ClientForm
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
        <q-toolbar-title><b>请输入客户信息</b></q-toolbar-title>
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
          ref="clientForm"
          @reset="reset"
          class="q-gutter-md"
        >
          <q-input
            outlined
            dense
            label="客户名称"
            v-model="clientInfo.clientName"
            debounce="2000"
            :rules="operation === 'edit' ? [] : [ clientNameVal ]"
          />
          <FixcodeSelect
            :fixcodetype="'2002'"
            v-model:model="clientInfo.clientType"
            :placeholder="'公司类型'"
            dense
            :rules="[ val => val !== '' || '请选择角色类型' ]"
          />
          <FixcodeSelect
            :fixcodetype="'2003'"
            v-model:model="clientInfo.declarePeriod"
            placeholder="申报周期"
            dense
            :rules="[ val => val !== '' || '请选择申报周期' ]"
          />
          <UserSelect
            v-if="store.getRoleType !== 20041003"
            v-model:model="clientInfo.optId"
            roletype="20041003"
            placeholder="请选择负责人"
            dense
            clearable
          />
          <UserSelect
            v-model:model="clientInfo.approveId"
            roletype="20041002"
            placeholder="请选择审批人"
            dense
            clearable
          />
          <q-input
            outlined
            dense
            label="ICT"
            v-model="clientInfo.clientIct"
            :rules="[ val => val && val.length > 0 || '请输入客户ICT']"
          />
          <q-input
            outlined
            dense
            label="VAT"
            v-model="clientInfo.clientVat"
            :rules="[ val => val && val.length > 0 || '请输入客户VAT']"
          />
          <q-input
            outlined
            dense
            label="税号"
            v-model="clientInfo.clientTaxNo"
            :rules="[ val => val && val.length > 0 || '请输入客户税号']"
          />
          <q-input
            outlined
            dense
            label="工商号"
            v-model="clientInfo.clientKbk"
            :rules="[ val => val && val.length > 0 || '请输入客户工商号']"
          />
          <q-input
            outlined
            dense
            v-model="clientInfo.serviceStart"
            type="date"
            hint="开始服务日期"
            :rules="[ val => val && val.length > 0 || '请输入开始服务日期']"
          />
          <q-input
            outlined
            dense
            v-model="clientInfo.serviceEnd"
            type="date"
            hint="结束服务日期"
          />
          <q-input
            outlined
            dense
            label="地址"
            v-model="clientInfo.clientAddress"
            :rules="[ val => val && val.length > 0 || '请输入客户地址']"
          />
          <q-input
            outlined
            dense
            label="电子邮箱"
            v-model="clientInfo.clientEmail"
            :rules="[ val => val && val.length > 0 || '请输入客户电子邮箱']"
          />
          <q-input
            outlined
            dense
            label="电话"
            v-model="clientInfo.clientTel"
          />
          <q-input
            outlined
            dense
            label="手机"
            v-model="clientInfo.clientMobile"
          />
          <q-input
            outlined
            dense
            label="描述"
            v-model="clientInfo.description"
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
import { successNotify, warningNotify } from 'src/utils/Notify'
import { computed, ref, nextTick } from 'vue';
import { clientValidate, createClient, updateClientInfo } from 'src/api/clientmanager';
import UserSelect from 'components/UserSelect/UserSelect.vue';
import { useUserStore } from 'stores/user';

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

const clientInfo = defineModel('clientInfo')
const store = useUserStore()

const emit = defineEmits(['update:model', 'refreshList'])
const showDialog = computed({
  get() {
    return props.model
  },
  set(val) {
    emit('update:model', val)
  }
})

const clientForm = ref(null)
const handleCreate = () => {
  clientForm.value.validate().then(success => {
    if (success) {
      createClient(clientInfo.value).then(() => {
        successNotify('Created Successfully')
        nextTick(() => {
         props.reset()
         showDialog.value = false
         emit(props.invoke)
        })
      })
    } else {
      warningNotify('请完善客户信息')
    }
  })
}
const handleUpdate = () => {
  clientForm.value.validate().then(success => {
    if (success) {
      updateClientInfo(clientInfo.value).then(() => {
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
const clientNameVal = (val) => {
  if (null == val || val === '') {
    return '请输入客户名称'
  } else {
    return new Promise((resolve) => {
      clientValidate(val).then(res => {
        if (res.result === true && res.data === false) {
          resolve('该客户已经存在')
        } else {
          resolve(true)
        }
      })
    })
  }
}
</script>
