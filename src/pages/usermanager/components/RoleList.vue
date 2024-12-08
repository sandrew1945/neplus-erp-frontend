<!--
  说明：查询用户可添加角色组件。
  使用方法：引用组件，然后如下实用：

    <RoleList
      v-model:model="dialogFormVisible"
      :user-id="userId"
      @refresh="getList"
    />
  refresh中的方法名是角色新增后回调方法，不指定则默认为getList，其中getList为父组件定义的方法
  multi表示是否支持多选

  getList: function(data) {
    console.log(JSON.stringify(data))
  }
-->

<template>
  <StickDialog
    v-model:model="dialogFormVisible"
    position="top"
  >
    <q-card style="width: 650px;">
      <q-toolbar>
        <q-avatar>
          <img src="https://cdn.quasar.dev/logo/svg/quasar-logo.svg">
        </q-avatar>
        <q-toolbar-title><b>请选择要添加的角色</b></q-toolbar-title>
        <q-btn
          flat
          round
          dense
          icon="close"
          v-close-popup
        />
      </q-toolbar>
      <q-card-section>
        <div class="column">
          <div class="col-2 q-ma-lg q-gutter-md">
            <div class="row q-gutter-md">
              <q-input
                dense
                outlined
                v-model="roleName"
                placeholder="角色名称"
                class="col-md-6 col-xs-6"
              />
              <q-btn
                label="查询"
                icon="search"
                color="negative"
                @click="getUnRelationRoles"
              />
            </div>
          </div>
          <div
            class="col-10 q-ma-lg"
          >
            <PaginationTable
              row-key="userId"
              :data="unrelationlist"
              :columns="column"
              :loading="listLoading"
              :query="getUnRelationRoles"
            >
              <template
                v-if="$q.screen.gt.xs"
                v-slot:default="row"
              >
                <q-td>
                  <div class="row justify-center q-mx-md q-gutter-x-md">
                    <q-btn
                      color="primary"
                      size="sm"
                      label="添加"
                      icon="queue"
                      @click="handleAddRole(false, row.row.roleId)"
                    />
                  </div>
                </q-td>
              </template>
              <template
                v-else
                v-slot:default="row"
              >
                <div class="row q-mx-md q-gutter-x-md">
                  <q-btn
                    class="col"
                    round
                    color="primary"
                    size="xs"
                    icon="queue"
                    @click="handleAddRole(false, row.row.roleId)"
                  />
                </div>
              </template>
            </PaginationTable>
          </div>
        </div>
      </q-card-section>
    </q-card>
  </StickDialog>
</template>

<script setup lang="ts">
import { computed, defineProps, ref, watch } from 'vue';
import StickDialog from 'src/components/Dialog/StickDialog'
import { addRole, queryUnRelationRoles } from 'src/api/usermanager'
import PaginationTable from 'src/components/PaginationTable'
import { successNotify } from 'src/utils/Notify'
// import { successNotify, warningNotify } from 'src/utils/Notify'

const props = defineProps({
  model: {
    required: true,
    type: Boolean
  },
  userId: {
    required: true,
    type: String,
    default: ''
  }
})


const listLoading = ref(false)
// const list = ref(null)
const roleName =  ref('')
const unrelationlist = ref([])
const column = [
  { name: 'roleCode', label: '角色代码', field: 'roleCode', type: 'data', align: 'center', sortable: true },
  { name: 'roleName', label: '角色名称', field: 'roleName', type: 'data', align: 'center', sortable: false },
  { name: 'roleStatus', label: '状态', field: 'roleStatus', type: 'fixcode', align: 'center' },
  { name: 'roleId', label: '操作', field: 'roleId', type: 'slot', align: 'center', sortable: false }
]


const emit = defineEmits(['update:model', 'refresh'])
const dialogFormVisible = computed({
  get () {
    return props.model
  },
  set (val) {
    emit('update:model', val)
  }
})

watch(dialogFormVisible, (newVal) => {
  if (newVal) {
    getUnRelationRoles()
  }
})

const getUnRelationRoles = async () => {
  listLoading.value = true
  const param = { userId: props.userId, roleName: roleName.value }
  queryUnRelationRoles(param).then(response => {
    unrelationlist.value = response.data
    listLoading.value = false
  })
}
const handleAddRole = (closeModal, selected) => {
  const rolesArray = []
  if (selected) {
    rolesArray.push(selected)
  } else {
    selectedRoles.forEach(element => {
      rolesArray.push(element.roleId)
    })
  }
  const param = { userId: props.userId, rolesStr: rolesArray.join(',') }
  addRole(param).then(response => {
    if (response.result === true) {
      successNotify('Add Successfully')
    }
    if (closeModal) {
      dialogFormVisible.value = false
    }
    getUnRelationRoles()
    emit('refresh')
  })
}
</script>
