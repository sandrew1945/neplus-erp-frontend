<template>
  <q-page :class="$q.dark.isActive ? 'column bg-dark' : 'column bg-white'">
    <div class="col-2 q-ma-lg q-gutter-md">
      <div class="q-gutter-md row items-start">
        <n-container :sm="10" :mid="2" :lg="2">
          <q-input
            dense
            outlined
            v-model="listQuery.taskName"
            placeholder="任务名称"
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
        <n-container :sm="10" :mid="2" :lg="2">
          <q-input dense filled readonly :model-value="`${dateRange.from ? dateRange.from : 'dd-mm-yyyy'} to ${dateRange.to ? dateRange.to : 'dd-mm-yyyy'}`">
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                  <q-date v-model="dateRange" mask="DD-MM-YYYY" range>
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Close" color="primary" flat />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </n-container>
        <q-btn label="查询" :loading="listLoading" icon="search" color="primary" @click="handleFilter" />
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
                class="col-10"
                color="primary"
                padding="xs"
                size="sm"
                dense
                label="审批"
                icon="free_cancellation"
                @click="handleProcess(row.row.taskId)"
              />
            </div>
          </q-td>
        </template>
        <template v-else v-slot:default="row">
          <div class="row q-mx-md q-gutter-x-md">
            <q-btn
              class="col-10"
              round
              color="primary"
              size="xs"
              icon="free_cancellation"
              @click="handleProcess(row.row.taskId)"
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
import NContainer from 'src/components/NContainer/index.vue';
import { PageInfo } from 'src/models/generic-model';
import { TaskListQuery } from 'src/models/taskmanager-model';
import { getTaskList } from 'src/api/taskmanager';
import { useRouter } from 'vue-router';

const list = ref([]);
const listLoading = ref(false);
const dateRange = ref({from: '', to: ''})
const listQuery = ref<TaskListQuery>({
  curPage: 1,
  limit: 20,
  taskName: null,
  clientType: '',
  taskType: '',
  startFrom: null,
  endWith: null,
  taskStatus: ['20061003'],
});
const pagination = ref<PageInfo>({
  sortBy: 'desc',
  descending: false,
  page: 1,
  rowsPerPage: process.env.PAGESIZE,
  rowsNumber: 0,
});
const columns = [
  { name: 'taskName', label: '任务名称', field: 'taskName', width: '200px', type: 'data', align: 'center', sortable: true },
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
  listQuery.value.startFrom = dateRange.value.from;
  listQuery.value.endWith = dateRange.value.to;
  getTaskList(listQuery.value).then((response) => {
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

const router = useRouter()
const handleProcess = async (taskId: number) => {
  router.push({
    name: 'Process',
    params: {
      id: taskId,
      type: 'approve'
    }
  })
};
</script>
