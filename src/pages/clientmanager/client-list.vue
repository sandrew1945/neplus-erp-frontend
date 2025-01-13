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
            v-model="listQuery.clientName"
            placeholder="客户名称"
          />
        </n-container>
        <n-container
          :sm="10"
          :mid="2"
          :lg="2"
        >
          <FixcodeSelect
            :fixcodetype="'2002'"
            v-model:model="listQuery.clientType"
            placeholder="客户类型"
            dense
            clearable
          />
        </n-container>
        <n-container
          :sm="10"
          :mid="2"
          :lg="2"
        >
          <FixcodeSelect
            :fixcodetype="'2003'"
            v-model:model="listQuery.declareType"
            placeholder="申报周期"
            dense
            clearable
          />
        </n-container>
        <n-container
          :sm="10"
          :mid="2"
          :lg="2"
        >
        <UserSelect
          v-model:model="listQuery.optId"
          roletype="20041003"
          placeholder="会计师"
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
        row-key="clientId"
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
                class="col-4"
                :class="store.getRoleType === 20041003 ? 'col-10' : 'col-4'"
                color="secondary"
                padding="xs"
                size="sm"
                dense
                label="编辑"
                icon="edit"
                @click="handleUpdate(row.row.clientId)"
              />
              <q-btn
                v-if="store.getRoleType !== 20041003"
                class="col-4"
                color="negative"
                padding="xs"
                size="sm"
                dense
                label="删除"
                icon="delete"
                @click="handleDelete(row.row.clientId)"
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
              class="col-4"
              round
              color="secondary"
              size="xs"
              icon="edit"
              @click="handleUpdate(row.row.clientId)"
            />
            <q-btn
              v-if="store.getRoleType !== 20041003"
              class="col"
              round
              color="negative"
              size="xs"
              icon="delete"
              @click="handleDelete(row.row.clientId)"
            />
          </div>
        </template>
      </PaginationTable>
    </div>

    <ClientForm
      v-model:model="showEditor"
      :operation="operation"
      v-model:client-info="clientInfo"
      :reset="reset"
      invoke="refreshList"
      @refreshList="getList"
    />
  </q-page>
</template>

<script setup lang="ts">
import { ref, onBeforeMount } from 'vue'
import PaginationTable from 'src/components/PaginationTable/index.vue'
import FixcodeSelect from 'src/components/FixcodeSelect/index.vue'
import { successNotify } from 'src/utils/Notify'
import { confirm } from 'src/utils/Confirm'
import NContainer from 'src/components/NContainer/index.vue'
import { PageInfo } from 'src/models/generic-model';
import { ClientInfo, ClientListQuery } from 'src/models/clientmanager-model';
import { deleteClient, fetchClientInfo, getClientList } from 'src/api/clientmanager';
import ClientForm from 'pages/clientmanager/components/ClientForm.vue';
import { useUserStore } from 'stores/user';
import UserSelect from 'components/UserSelect/UserSelect.vue';
import { date } from 'quasar';

const store = useUserStore()
  const list = ref([])
  const listLoading = ref(false)
  const showEditor = ref(false)
  const operation = ref('')
  const clientInfo = ref<ClientInfo>({
    clientId: null,
    clientName: null,
    clientType: '',
    declarePeriod: '',
    optId: '',
    approveId: '',
    clientIct: null,
    clientVat: null,
    serviceStart: null,
    serviceEnd: null,
    clientEmail: null,
    clientTaxNo: null,
    clientKbk: null,
    clientFee: null,
    clientMobile: null,
    clientLinkman: null,
    clientAddress: null,
    clientPostcode: null,
    clientCity: null,
    description: null
  })

  // const page = ref(1)
  // const pageSize = ref(process.env.PAGESIZE)
  // const rowsNumber = ref(0)

  const listQuery = ref<ClientListQuery>({
    curPage: 1,
    limit: 20,
    clientName: null,
    declareType: '',
    clientType: '',
    clientStatus: '',
    optId: ''
  })
  const pagination = ref<PageInfo>({
    sortBy: 'desc',
    descending: false,
    page: 1,
    rowsPerPage: process.env.PAGESIZE,
    rowsNumber: 0
  })
  const columns = [
        { name: 'clientName', label: '客户名称', field: 'clientName', width: '200px', type: 'data', align: 'center', sortable: true },
        { name: 'clientType', label: '客户类型', field: 'clientType', type: 'fixcode', align: 'center', sortable: false },
        { name: 'declarePeriod', label: '申报周期', field: 'declarePeriod', type: 'fixcode', align: 'center', sortable: false },
        { name: 'optName', label: '负责人', field: 'optName', type: 'data', align: 'center', sortable: false },
        { name: 'approveName', label: '审批人', field: 'approveName', type: 'data', align: 'center', sortable: false },
        { name: 'clientIct', label: 'ICT', field: 'clientIct', type: 'data', align: 'center', sortable: false },
        { name: 'clientVat', label: 'VAT', field: 'clientVat', type: 'data', align: 'center', sortable: false },
        { name: 'clientId', label: '操作', field: 'clientId', type: 'slot', align: 'center', sortable: false }
  ]

  onBeforeMount(() => {
    getList()
  })

  const getList = () => {
    listLoading.value = true
    listQuery.value.curPage = pagination.value.page
    listQuery.value.limit = pagination.value.rowsPerPage
    reset()
    getClientList(listQuery.value).then(response => {
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


  const handleDelete = (clientId: number) => {
    confirm('注意', '是否删除该客户？', () => {
        const param = { clientId: clientId }
        deleteClient(param).then((res) => {
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
    reset()
  }

  const handleUpdate = async(clientId: number) => {
    operation.value = 'edit'
    await fetchClientInfo(clientId).then((res) => {
      let serviceStart = ''
      let serviceEnd = ''
      if (res.data.serviceStart) {
        serviceStart = date.formatDate(res.data.serviceStart, 'DD-MM-YYYY')
      }
      if (res.data.serviceEnd) {
        serviceEnd = date.formatDate(res.data.serviceEnd, 'DD-MM-YYYY')
      }
      clientInfo.value.clientId = res.data.clientId
      clientInfo.value.clientName = res.data.clientName
      clientInfo.value.clientType = '' + res.data.clientType
      clientInfo.value.declarePeriod = '' + res.data.declarePeriod
      clientInfo.value.optId = res.data.optId
      clientInfo.value.approveId = res.data.approveId
      clientInfo.value.clientIct = res.data.clientIct
      clientInfo.value.clientVat = res.data.clientVat
      clientInfo.value.clientTaxNo = res.data.clientTaxNo
      clientInfo.value.clientKbk = res.data.clientKbk
      clientInfo.value.clientAddress = res.data.clientAddress
      clientInfo.value.clientPostcode = res.data.clientPostcode
      clientInfo.value.clientCity = res.data.clientCity
      clientInfo.value.clientEmail = res.data.clientEmail
      clientInfo.value.clientLinkman = res.data.clientLinkman
      clientInfo.value.clientMobile = res.data.clientMobile
      clientInfo.value.description = res.data.description
      clientInfo.value.serviceStart = serviceStart
      clientInfo.value.serviceEnd = serviceEnd
      showEditor.value = true
    })
  }

  const reset = () => {
    clientInfo.value = {
      clientId: null,
      clientName: null,
      clientType: '',
      declarePeriod: null,
      optId: null,
      approveId: null,
      clientIct: null,
      clientVat: null,
      serviceStart: null,
      serviceEnd: null,
      clientTaxNo: null,
      clientKbk: null,
      clientFee: null,
      clientEmail: null,
      clientMobile: null,
      clientLinkman: null,
      clientAddress: null,
      clientPostcode: null,
      clientCity: null,
      description: null
    }
  }
</script>
