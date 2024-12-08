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
    v-model:model="showCreate"
    position="top"
  >
    <q-card style="width: 650px;">
      <q-toolbar>
        <q-avatar>
          <img src="https://cdn.quasar.dev/logo/svg/quasar-logo.svg">
        </q-avatar>
        <q-toolbar-title><b>请输入菜单信息</b></q-toolbar-title>
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
          ref="my"
          :dense="$q.screen.lt.sm ? true : false"
          class="q-gutter-md q-ma-md col-md-6"
        >
          <q-input
            outlined
            :dense="$q.screen.lt.sm ? true : false"
            label="路径"
            v-model="node.path"
            :rules="[
              val => val !== null && val !== '' || '请输入菜单路径',
            ]"
          />
          <q-input
            outlined
            :dense="$q.screen.lt.sm ? true : false"
            v-model="node.icon"
            label="图标"
            :rules="[
              val => val !== null && val !== '' || '请输入图标代码',
            ]"
          />
          <q-input
            outlined
            :dense="$q.screen.lt.sm ? true : false"
            v-model="node.name"
            label="菜单名"
            :rules="[
              val => val !== null && val !== '' || '请输入菜单名称',
            ]"
          />
          <q-input
            outlined
            type="number"
            :dense="$q.screen.lt.sm ? true : false"
            v-model="node.funcOrder"
            label="菜单顺序"
            :rules="[
              val => val !== null && val !== '' || '请输入数字格式的顺序',
            ]"
          />
          <q-btn
            label="Create"
            type="button"
            color="warning"
            icon="add"
            @click="doCreate"
          />
        </q-form>
      </q-card-section>
    </q-card>
  </StickDialog>
</template>

<script setup lang="ts">
import StickDialog from 'src/components/Dialog/StickDialog'
import { createMenu } from 'src/api/funcmanager'
import { successNotify, warningNotify } from 'src/utils/Notify'
import { computed, ref, watch } from 'vue';

const props = defineProps({
  model: {
    required: true,
    type: Boolean
  },
  fatherId: {
    required: false,
    type: String,
    default: ''
  },
  fatherPath: {
    required: false,
    type: String,
    default: ''
  },
  invoke: {
    required: true,
    type: String,
    default: 'getList'
  }
})


const node = ref({
  path: '',
  name: '',
  title: '',
  icon: '',
  funcOrder: '',
  fatherId: ''
})

const emit = defineEmits(['update:model', 'refreshTree'])
const showCreate = computed({
  get() {
    return props.model
  },
  set(val) {
    emit('update:model', val)
  }
})

watch(showCreate, (newVal) => {
  if (newVal) {
    node.value.path = props.fatherPath
  }
})

const my = ref(null)
const doCreate = () => {
  my.value.validate().then(success => {
    if (success) {
      node.value.fatherId = props.fatherId
      createMenu(node.value).then(() => {
        emit('refreshTree')
        reset()
        showCreate.value = false
        successNotify('Create Successfully')
      })
    } else {
      warningNotify('请完善菜单信息')
    }
  })
}
const reset = () => {
  node.value = {
    path: '',
    name: '',
    title: '',
    icon: '',
    funcOrder: '',
    fatherId: ''
  }
}
</script>
