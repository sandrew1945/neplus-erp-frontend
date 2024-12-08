<template>
  <q-page :class="$q.dark.isActive ? 'column bg-dark' : 'column bg-white'">
    <div class="col-2 q-ma-lg q-gutter-md">
      <div class="row q-gutter-md">
        <n-container
          :sm="5"
          :mid="2"
          :lg="2"
        >
          <q-input
            dense
            outlined
            v-model="listQuery.userCode"
            placeholder="用户账号"
          />
        </n-container>
        <n-container
          :sm="5"
          :mid="2"
          :lg="2"
        >
          <q-input
            dense
            outlined
            v-model="listQuery.userName"
            placeholder="用户姓名"
          />
        </n-container>
        <n-container
          :sm="10"
          :mid="2"
          :lg="2"
        >
          <FixcodeSelect
            :fixcodetype="'2001'"
            v-model:model="listQuery.userStatus"
            :placeholder="'用户状态'"
            dense
            clearable
          />
        </n-container>
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
        v-model:pagination="pagination"
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
                @click="handleUpdate(row.row.userId)"
              />
              <q-btn
                class="col-3"
                color="negative"
                padding="xs"
                size="sm"
                dense
                label="删除"
                icon="delete"
                @click="handleDelete(row.row.userId)"
              />
              <q-btn
                class="col-3"
                color="warning"
                padding="xs"
                size="sm"
                dense
                label="角色"
                icon="perm_identity"
                @click="handleRoles(row.row.userId)"
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
              @click="handleUpdate(row.row.userId)"
            />
            <q-btn
              class="col"
              round
              color="negative"
              size="xs"
              icon="delete"
              @click="handleDelete(row.row.userId)"
            />
            <q-btn
              class="col"
              round
              color="warning"
              size="xs"
              icon="perm_identity"
              @click="handleRoles(row.row.userId)"
            />
          </div>
        </template>
      </PaginationTable>
    </div>

    <UserForm
      v-model:model="showEditor"
      :operation="operation"
      v-model:user-info="userInfo"
      :reset="resetUser"
      @refresh="getList"
    />
  </q-page>
</template>

<script setup lang="ts">
import { ref, onBeforeMount } from 'vue'
import { getUserList, fetchUserInfo, deleteUser } from 'src/api/usermanager'
import PaginationTable from 'src/components/PaginationTable/index.vue'
import FixcodeSelect from 'src/components/FixcodeSelect/index.vue'
import UserForm from 'src/pages/usermanager/components/UserForm.vue'
import { successNotify } from 'src/utils/Notify'
import { confirm } from 'src/utils/Confirm'
import { date } from 'quasar'
import NContainer from 'src/components/NContainer/index.vue'
import { UserInfo, UserListQuery } from 'src/models/usermanager-model';
import { PageInfo } from 'src/models/generic-model';
import { useRouter } from 'vue-router'

  // const tableKey = ref(0)
  const list = ref([])
  const listLoading = ref(false)
  const showEditor = ref(false)
  const operation = ref('')
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

  // const page = ref(1)
  // const pageSize = ref(process.env.PAGESIZE)
  // const rowsNumber = ref(0)

  const listQuery = ref<UserListQuery>({
    curPage: 1,
    limit: 20,
    userCode: '',
    userName: '',
    userStatus: ''
  })
  const pagination = ref<PageInfo>({
    sortBy: 'desc',
    descending: false,
    page: 1,
    rowsPerPage: process.env.PAGESIZE,
    rowsNumber: 0
  })
  const columns = [
        { name: 'userCode', label: '账号', field: 'userCode', width: '200px', type: 'data', align: 'center', sortable: true },
        { name: 'userName', label: '姓名', field: 'userName', type: 'data', align: 'center', sortable: false },
        { name: 'roleName', label: '角色', field: 'roleName', type: 'data', align: 'center', sortable: false },
        { name: 'sex', label: '性别', field: 'sex', type: 'fixcode', align: 'center', sortable: false },
        { name: 'userStatus', label: '状态', field: 'userStatus', type: 'fixcode', align: 'center', sortable: false },
        { name: 'userId', label: '操作', field: 'userId', type: 'slot', align: 'center', sortable: false }
  ]

  onBeforeMount(() => {
    getList()
  })

  const getList = () => {
    listLoading.value = true
    listQuery.value.curPage = pagination.value.page
    listQuery.value.limit = pagination.value.rowsPerPage
    resetUser()
    getUserList(listQuery.value).then(response => {
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


  const handleDelete = (userId: number) => {
    confirm('注意', '是否删除该用户？', () => {
        const param = { userId: userId }
        deleteUser(param).then((res) => {
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
    resetUser()
  }

  const handleUpdate = async(userId: number) => {
    operation.value = 'edit'
    await fetchUserInfo(userId).then((res) => {
      let birthday = ''
      if (res.data.birthday) {
        // const extractBirthday = date.extractDate(res.data.birthday, 'YYYY-MM-DD HH:mm:ss')
        birthday = date.formatDate(res.data.birthday, 'YYYY-MM-DD')
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
      // if (res.data.avatar !== '') {
      //   this.imageUrl = process.env.VUE_APP_BASE_API + '/generate/loadImage?filePath=' + res.data.avatar
      // } else {
      //   this.imageUrl = defAvatar
      // }
      showEditor.value = true
    })
  }

  const router = useRouter()
  const handleRoles = (userId: number) => {
    router.push({
      name: 'manageroles',
      params: {
        id: userId
      }
    })
  }

  const resetUser = () => {
    userInfo.value = {
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
      }
  }
</script>
