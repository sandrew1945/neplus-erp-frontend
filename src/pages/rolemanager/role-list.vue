<template>
  <q-page :class="$q.dark.isActive ? 'column bg-dark' : 'column bg-white'">
    <div class="col-2 q-ma-lg q-gutter-md">
      <div class="row q-gutter-md">
        <q-input
          dense
          outlined
          v-model="listQuery.roleCode"
          placeholder="角色代码"
          class="col-md-2 col-xs-3"
        />
        <q-input
          dense
          outlined
          v-model="listQuery.roleName"
          placeholder="角色名称"
          class="col-md-2 col-xs-3"
        />
        <FixcodeSelect
          :fixcodetype="'1001'"
          v-model:model="listQuery.roleStatus"
          :placeholder="'角色状态'"
          class="col-md-2 col-xs-3"
          dense
          clearable
        />
        <q-btn
          label="查询"
          :loading="listLoading"
          icon="search"
          color="primary"
          @click="handleFilter"
        />
        <q-btn
          label="新增"
          icon="add"
          color="negative"
          @click="handleCreate"
        />
      </div>
    </div>
    <div
      class="col-10 q-ma-lg"
    >
      <PaginationTable
        row-key="userId"
        :data="list"
        :columns="columns"
        :loading="listLoading"
        :pagination="pagination"
        :query="getList"
      >
        <template
          v-if="$q.screen.gt.xs"
          v-slot:default="row"
        >
          <q-td
            width="300px"
          >
            <div class="row q-mx-md q-gutter-x-md">
              <q-btn
                class="col-3"
                color="secondary"
                padding="xs"
                size="sm"
                dense
                label="编辑"
                icon="edit"
                @click="handleUpdate(row.row.roleId)"
              />
              <q-btn
                class="col-3"
                color="negative"
                padding="xs"
                size="sm"
                dense
                label="删除"
                icon="delete"
                @click="handleDelete(row.row.roleId)"
              />
              <q-btn
                class="col-3"
                color="warning"
                padding="xs"
                size="sm"
                dense
                label="权限"
                icon="account_tree"
                @click="handleRoles(row.row.roleId)"
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
              color="secondary"
              size="xs"
              icon="edit"
              @click="handleUpdate(row.row.roleId)"
            />
            <q-btn
              class="col"
              round
              color="negative"
              size="xs"
              icon="delete"
              @click="handleDelete(row.row.roleId)"
            />
            <q-btn
              class="col"
              round
              color="warning"
              size="xs"
              icon="account_tree"
              @click="handleRoles(row.row.roleId)"
            />
          </div>
        </template>
      </PaginationTable>
    </div>
    <RoleForm
      v-model:model="showEditor"
      :operation="operation"
      :role-info="role"
      :reset="resetRole"
      :invoke="'refreshList'"
      @refreshList="getList"
    />
  </q-page>
</template>

<script setup lang="ts">
import { getRoleList, deleteRole, fetchRoleInfo } from 'src/api/rolemanager'
import FixcodeSelect from 'src/components/FixcodeSelect/index.vue'
import PaginationTable from 'src/components/PaginationTable/index.vue'
import RoleForm from './components/RoleForm.vue'
import { successNotify } from 'src/utils/Notify'
import { confirm } from 'src/utils/Confirm'
import { onBeforeMount, ref } from 'vue';
import { useRouter } from 'vue-router';


const list = ref([])
const listLoading = ref(false)
const showEditor = ref(false)
const operation = ref('')
const role = ref({
  roleId: '',
  roleCode: '',
  roleName: '',
  roleType: '',
  roleStatus: ''
})
const listQuery = ref({
  curPage: 1,
    limit: 20,
    roleCode: undefined,
    roleName: undefined,
    roleStatus: ''
})
const pagination = ref({
  sortBy: 'desc',
    descending: false,
    page: 1,
    rowsPerPage: process.env.PAGESIZE,
    rowsNumber: 0
})
const columns = [
  { name: 'roleCode', label: '角色代码', field: 'roleCode', width: '200px', type: 'data', align: 'center', sortable: true },
  { name: 'roleName', label: '角色名称', field: 'roleName', type: 'data', align: 'center', sortable: false },
  { name: 'roleType', label: '角色类型', field: 'roleType', type: 'fixcode', align: 'center', sortable: false },
  { name: 'roleStatus', label: '角色状态', field: 'roleStatus', type: 'fixcode', align: 'center', sortable: false },
  { name: 'roleId', label: '操作', field: 'roleId', type: 'slot', align: 'center', sortable: false }
]

onBeforeMount(() => {
  getList()
})

const getList = () => {
  listLoading.value = true
  listQuery.value.curPage = pagination.value.page
  listQuery.value.limit = pagination.value.rowsPerPage
  resetRole()
  getRoleList(listQuery.value).then(response => {
    list.value = response.data.records
    pagination.value.rowsNumber = response.data.totalRecords
    // Just to simulate the time of the request
    listLoading.value = false
  })
}
const handleFilter = () => {
  pagination.value.page = 1
  getList()
}
const handleDelete = (roleId) => {
  confirm('注意', '是否删除该角色？', () => {
    const param = { roleId: roleId }
    deleteRole(param).then((res) => {
      if (res.data === true) {
        successNotify('Delete Successfully')
        handleFilter()
      }
    })
  })
}
const handleCreate = () => {
  operation.value = 'create'
  showEditor.value = true
  resetRole()
}
const handleUpdate = async(roleId) => {
  operation.value = 'edit'
  await fetchRoleInfo(roleId).then((res) => {
    role.value.roleId = res.data.roleId
    role.value.roleCode = res.data.roleCode
    role.value.roleName = res.data.roleName
    role.value.roleType = '' + res.data.roleType
    role.value.roleStatus = '' + res.data.roleStatus
    showEditor.value = true
  })
}

const router = useRouter()
const handleRoles = (userId) => {
  router.push({
    name: 'permission',
    params: {
      id: userId
    }
  })
}
const resetRole = () => {
  role.value = {
    roleId: '',
    roleCode: '',
    roleName: '',
    roleType: '',
    roleStatus: ''
  }
}

</script>
