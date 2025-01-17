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
            v-model="listQuery.templateName"
            placeholder="模版名称"
          />
        </n-container>
        <n-container
          :sm="10"
          :mid="2"
          :lg="2"
        >
          <FixcodeSelect
            :fixcodetype="'1001'"
            v-model:model="listQuery.templateStatus"
            :placeholder="'模版状态'"
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
            <div class="row justify-around q-gutter-x-md">
              <q-btn
                class="col-4"
                color="secondary"
                padding="xs"
                size="sm"
                dense
                label="编辑"
                icon="edit"
                @click="handleUpdate(row.row.templateId)"
              />
              <q-btn
                class="col-4"
                color="negative"
                padding="xs"
                size="sm"
                dense
                label="删除"
                icon="delete"
                @click="handleDelete(row.row.templateId)"
              />
            </div>
          </q-td>
        </template>
        <template
          v-else
          v-slot:default="row"
        >
          <div class="row justify-around">
            <q-btn
              class="col-sm-2"
              round
              color="secondary"
              size="xs"
              icon="edit"
              @click="handleUpdate(row.row.templateId)"
            />
            <q-btn
              class="col-sm-2"
              round
              color="negative"
              size="xs"
              icon="delete"
              @click="handleDelete(row.row.templateId)"
            />
          </div>
        </template>
      </PaginationTable>
    </div>

    <MailTemplateForm
      v-model:model="showEditor"
      :operation="operation"
      v-model:mail-template-info="mailTemplateInfo"
      :reset="resetData"
      @refresh="getList"
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
import { MailListQuery, MailTemplateInfo } from 'src/models/mailmanager-model';
import { PageInfo } from 'src/models/generic-model';
import { deleteMailTemplate, fetchMailTemplate, getMailTemplateList } from 'src/api/mailmanager';
import MailTemplateForm from 'pages/mailmanager/components/MailTemplateForm.vue';

// const tableKey = ref(0)
const list = ref([])
const listLoading = ref(false)
const showEditor = ref(false)
const operation = ref('')
const mailTemplateInfo = ref<MailTemplateInfo>({
  templateId: null,
  templateName: null,
  templateSubject: null,
  templateContent: null,
  templateStatus: ''
})


const listQuery = ref<MailListQuery>({
  curPage: 1,
  limit: 20,
  templateName: null,
  templateContent: null,
  templateStatus: ''
})
const pagination = ref<PageInfo>({
  sortBy: 'desc',
  descending: false,
  page: 1,
  rowsPerPage: process.env.PAGESIZE,
  rowsNumber: 0
})
const columns = [
  { name: 'templateName', label: '模版名称', field: 'templateName', type: 'data', align: 'center', sortable: false },
  { name: 'templateSubject', label: '邮件主题', field: 'templateSubject', type: 'data', align: 'center', sortable: false },
  { name: 'templateContent', label: '邮件正文', field: 'templateContent', type: 'fixedSize', startIdx: '0', length: '100', align: 'center', sortable: false },
  { name: 'templateStatus', label: '模版状态', field: 'templateStatus', type: 'fixcode', align: 'center' ,sortable: false },
  { name: 'templateId', label: '操作', field: 'templateId', type: 'slot', align: 'center', sortable: false }
]

onBeforeMount(() => {
  getList()
})

const getList = () => {
  listLoading.value = true
  listQuery.value.curPage = pagination.value.page
  listQuery.value.limit = pagination.value.rowsPerPage
  resetData()
  getMailTemplateList(listQuery.value).then(response => {
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


const handleDelete = (templateId: number) => {
  confirm('注意', '是否删除该模版？', () => {
    const param = { templateId: templateId }
    deleteMailTemplate(param).then((res) => {
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
  resetData()
}

const handleUpdate = async(templateId: number) => {
  operation.value = 'edit'
  await fetchMailTemplate(templateId).then((res) => {
    mailTemplateInfo.value.templateId = res.data.templateId
    mailTemplateInfo.value.templateName = res.data.templateName
    mailTemplateInfo.value.templateSubject = res.data.templateSubject
    mailTemplateInfo.value.templateContent = res.data.templateContent
    mailTemplateInfo.value.templateStatus = '' + res.data.templateStatus
    showEditor.value = true
  })
}

const resetData = () => {
  mailTemplateInfo.value = {
    templateId: null,
    templateName: null,
    templateContent: null,
    templateStatus: ''
  }
}
</script>
