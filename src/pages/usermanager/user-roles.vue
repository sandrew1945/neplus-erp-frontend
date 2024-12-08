<template>
  <q-page :class="$q.dark.isActive ? 'column bg-dark' : 'column bg-white'">
    <div class="col-2 q-ma-lg q-gutter-md">
      <div class="row q-gutter-md">
        <q-input
          dense
          outlined
          v-model="userInfo.userCode"
          disable
          placeholder="用户账号"
          class="col-md-2 col-xs-3"
        />
        <q-input
          dense
          outlined
          v-model="userInfo.userName"
          disable
          placeholder="用户姓名"
          class="col-md-2 col-xs-3"
        />
        <q-btn
          label="选择可添加角色"
          icon="grading"
          color="primary"
          @click="dialogFormVisible = true"
        />
        <q-btn
          label="返回"
          icon="reply"
          color="grey"
          @click="cancel"
        />
      </div>
    </div>
    <div
      class="col-10 q-ma-lg"
    >
      <PaginationTable
        row-key="userId.value"
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
          <q-td>
            <div class="row justify-center q-mx-md q-gutter-x-md">
              <q-btn
                color="negative"
                size="sm"
                label="删除"
                icon="delete"
                @click="handleDelete(row.row.roleId)"
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
              color="negative"
              size="xs"
              icon="delete"
              @click="handleDelete(row.row.roleId)"
            />
          </div>
        </template>
      </PaginationTable>
    </div>
    <RoleList
      v-model:model="dialogFormVisible"
      :user-id="userId"
      @refresh="getList"
    />
  </q-page>
</template>

<script setup lang="ts">
import { onBeforeMount, ref } from 'vue';
import { queryRelationRoles, deleteRole, fetchUserInfo } from 'src/api/usermanager';
import PaginationTable from 'src/components/PaginationTable/index.vue'
import { successNotify } from 'src/utils/Notify'
import { confirm } from 'src/utils/Confirm'
import { PageInfo } from 'src/models/generic-model'
import { useRoute, useRouter } from 'vue-router'
import RoleList from 'pages/usermanager/components/RoleList.vue'

const list = ref([])
const listLoading = ref(false)
const pagination = ref<PageInfo>({
  sortBy: 'desc',
  descending: false,
  page: 1,
  rowsPerPage: 2,
  rowsNumber: 0
})
const userId = ref('')
// const roleName = ref('')
const userInfo = ref({})
const dialogFormVisible = ref(false)
// const selectedRoles = ref([])
const columns = [
  { name: 'roleCode', label: '角色代码', field: 'roleCode', type: 'data', align: 'center', sortable: true },
  { name: 'roleName', label: '角色名称', field: 'roleName', type: 'data', align: 'center', sortable: false },
  { name: 'roleId', label: '操作', field: 'roleId', type: 'slot', align: 'center', sortable: false }
]

const route = useRoute()
const router = useRouter()
onBeforeMount(() => {
  userId.value = '' + route.params.id
  getUserInfo()
  getList()
})

const getUserInfo = () => {
  fetchUserInfo(userId.value).then(response => {
    userInfo.value = response.data
  })
}
const getList = () => {
  listLoading.value = true
  queryRelationRoles(userId.value).then(response => {
    list.value = response.data
    listLoading.value = false
  })
}

const handleDelete = (roleId) => {
  confirm('注意', '是否删除该角色？', () => {
    const param = { userId: userId.value, roleId: roleId }
    deleteRole(param).then((res) => {
      if (res.result === true) {
        successNotify('Delete Successfully')
      }
      getList()
    })
  })
}
const cancel = () => {
  router.back(-1)
}
</script>
