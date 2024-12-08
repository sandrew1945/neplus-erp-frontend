<template>
  <q-page :class="$q.dark.isActive ? 'column bg-dark' : 'column bg-white'">
    <div class="col-2 q-ma-lg q-gutter-md">
      <div class="row q-gutter-md">
        <n-container :sm="5" :mid="2" :lg="2">
          <q-input
            dense
            outlined
            v-model="listQuery.clientName"
            placeholder="客户名称"
          />
        </n-container>
        <n-container :sm="10" :mid="2" :lg="2">
          <FixcodeSelect
            :fixcodetype="'2002'"
            v-model:model="listQuery.clientType"
            placeholder="客户类型"
            dense
            clearable
          />
        </n-container>
        <n-container :sm="10" :mid="2" :lg="2">
          <FixcodeSelect
            :fixcodetype="'2005'"
            v-model:model="listQuery.taskType"
            placeholder="任务类型"
            dense
            clearable
          />
        </n-container>
        <q-btn label="查询" :loading="listLoading" icon="search" color="primary" @click="handleFilter" />
      </div>
      <div class="row q-gutter-md">
        <n-container :sm="10" :mid="2" :lg="2">
          <FixcodeSelect
            :fixcodetype="'2006'"
            v-model:model="listQuery.taskStatus"
            placeholder="任务状态"
            dense
            clearable
          />
        </n-container>
        <n-container :sm="10" :mid="2" :lg="2">
          <q-input
            outlined
            dense
            v-model="listQuery.startFrom"
            type="date"
            clearable
            hint="开始日期"
          />
        </n-container>
        <n-container :sm="10" :mid="2" :lg="2">
          <q-input
            outlined
            dense
            v-model="listQuery.endWith"
            type="date"
            clearable
            hint="结束日期"
          />
        </n-container>
      </div>
    </div>
    <div class="col-10 q-ma-lg">
      <PaginationTable
        row-key="taskId"
        :data="list"
        :columns="columns"
        :loading="listLoading"
        v-model:pagination="pagination"
        :query="getList"
      >
        <template v-if="$q.screen.gt.xs" v-slot:default="row">
          <q-td width="300px">
            <div class="row q-mx-md q-gutter-x-md">
              <q-btn
                class="col-4"
                :class="store.getRoleType === 20041003 ? 'col-10' : 'col-4'"
                color="warning"
                padding="xs"
                size="sm"
                dense
                label="处理"
                icon="mail_outline"
                @click="handleProcess(row.row.taskId)"
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
                @click="handleDelete(row.row.taskId)"
              />
            </div>
          </q-td>
        </template>
        <template v-else v-slot:default="row">
          <div class="row q-mx-md q-gutter-x-md">
            <q-btn
              class="col-4"
              round
              color="warning"
              size="xs"
              icon="mail_outline"
              @click="handleProcess(row.row.taskId)"
            />
            <q-btn
              v-if="store.getRoleType !== 20041003"
              class="col"
              round
              color="negative"
              size="xs"
              icon="delete"
              @click="handleDelete(row.row.taskId)"
            />
          </div>
        </template>
      </PaginationTable>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onBeforeMount } from 'vue';
import PaginationTable from 'src/components/PaginationTable/index.vue';
import FixcodeSelect from 'src/components/FixcodeSelect/index.vue';
import { successNotify } from 'src/utils/Notify';
import { confirm } from 'src/utils/Confirm';
import NContainer from 'src/components/NContainer/index.vue';
import { PageInfo } from 'src/models/generic-model';
import { useUserStore } from 'stores/user';
import { TaskListQuery } from 'src/models/taskmanager-model';
import { deleteTask, getTaskList } from 'src/api/taskmanager';
import { useRouter } from 'vue-router';

const store = useUserStore();
const list = ref([]);
const listLoading = ref(false);

// const page = ref(1)
// const pageSize = ref(process.env.PAGESIZE)
// const rowsNumber = ref(0)
const listQuery = ref<TaskListQuery>({
  curPage: 1,
  limit: 20,
  clientName: null,
  clientType: '',
  taskType: '',
  startFrom: null,
  endWith: null,
  taskStatus: '',
});
const pagination = ref<PageInfo>({
  sortBy: 'desc',
  descending: false,
  page: 1,
  rowsPerPage: process.env.PAGESIZE,
  rowsNumber: 0,
});
const columns = [
  { name: 'clientName', label: '客户名称', field: 'clientName', width: '200px', type: 'data', align: 'center', sortable: true },
  { name: 'clientType', label: '客户类型', field: 'clientType', type: 'fixcode', align: 'center', sortable: false },
  { name: 'taskType', label: '任务类型', field: 'taskType', type: 'fixcode', align: 'center', sortable: false },
  { name: 'taskStatus', label: '任务状态', field: 'taskStatus', type: 'fixcode', align: 'center', sortable: false },
  { name: 'createDate', label: '创建日期', field: 'createDate', type: 'date', format: 'DD-MM-YYYY', align: 'center', sortable: false },
  { name: 'optName', label: '负责人', field: 'optName', type: 'data', align: 'center', sortable: false },
  { name: 'approveName', label: '审批人', field: 'approveName', type: 'data', align: 'center', sortable: false },
  { name: 'decDraftSendDate', label: '草稿发送日期', field: 'decDraftSendDate', type: 'date', format: 'DD-MM-YYYY', align: 'center', sortable: false },
  { name: 'decFormSendDate', label: '申报单发送日期', field: 'decFormSendDate', type: 'date', format: 'DD-MM-YYYY', align: 'center', sortable: false },
  { name: 'clientId', label: '操作', field: 'clientId', type: 'slot', align: 'center', sortable: false }
]

onBeforeMount(() => {
  getList();
});

const getList = () => {
  listLoading.value = true;
  listQuery.value.curPage = pagination.value.page;
  listQuery.value.limit = pagination.value.rowsPerPage;
  getTaskList(listQuery.value).then((response) => {
    console.log(response.data);
    list.value = response.data.records;
    pagination.value.rowsNumber = response.data.totalRecords;
    // Just to simulate the time of the request
    listLoading.value = false;
  });
};

const handleFilter = () => {
  pagination.value.page = 1;
  getList();
};

const handleDelete = (taskId: number) => {
  confirm('注意', '是否删除该任务？', () => {
    const param = { taskId: taskId };
    deleteTask(param).then((res) => {
      if (res.data === true) {
        successNotify('Delete Successfully');
        handleFilter();
      }
    });
  });
};

const router = useRouter()
const handleProcess = async (taskId: number) => {
  router.push({
    name: 'Process',
    params: {
      id: taskId
    }
  })
  // operation.value = 'edit';
  // await fetchClientInfo(clientId).then((res) => {
  //   console.log(JSON.stringify(res));
  //   let serviceStart = '';
  //   let serviceEnd = '';
  //   if (res.data.serviceStart) {
  //     // const extractBirthday = date.extractDate(res.data.birthday, 'YYYY-MM-DD HH:mm:ss')
  //     serviceStart = date.formatDate(res.data.serviceStart, 'YYYY-MM-DD');
  //   }
  //   if (res.data.serviceEnd) {
  //     serviceEnd = date.formatDate(res.data.serviceEnd, 'YYYY-MM-DD');
  //   }
  //   clientInfo.value.clientId = res.data.clientId;
  //   clientInfo.value.clientName = res.data.clientName;
  //   clientInfo.value.clientType = '' + res.data.clientType;
  //   clientInfo.value.declarePeriod = '' + res.data.declarePeriod;
  //   clientInfo.value.optId = res.data.optId;
  //   clientInfo.value.approveId = res.data.approveId;
  //   clientInfo.value.clientIct = res.data.clientIct;
  //   clientInfo.value.clientVat = res.data.clientVat;
  //   clientInfo.value.clientTaxNo = res.data.clientTaxNo;
  //   clientInfo.value.clientKbk = res.data.clientKbk;
  //   clientInfo.value.clientAddress = res.data.clientAddress;
  //   clientInfo.value.clientEmail = res.data.clientEmail;
  //   clientInfo.value.clientTel = res.data.clientTel;
  //   clientInfo.value.clientMobile = res.data.clientMobile;
  //   clientInfo.value.description = res.data.description;
  //   clientInfo.value.serviceStart = serviceStart;
  //   clientInfo.value.serviceEnd = serviceEnd;
  //   showEditor.value = true;
  // });
};
</script>
