<template>
  <q-page :class="$q.dark.isActive ? 'column bg-dark' : 'column bg-white'">
    <div class="col-2 q-ma-lg q-gutter-md">
      <div class="row q-gutter-md">
        <q-input
          dense
          v-if="$q.screen.gt.xs"
          outlined
          v-model="taskInfo.clientName"
          readonly
          label="客户名"
          class="col-md-2 col-xs-4"
        />
        <q-input
          dense
          outlined
          v-model="taskInfo.clientEmail"
          readonly
          label="客户邮箱"
          class="col-md-2 col-xs-6"
        />
        <q-input
          dense
          outlined
          v-model="taskInfo.clientMobile"
          readonly
          label="客户手机"
          class="col-md-2 col-xs-6"
        />
        <FixcodeSelect
          :fixcodetype="'2005'"
          v-model="taskInfo.taskType"
          placeholder="任务类型"
          dense
          readonly
          class="col-md-2 col-xs-4"
          model=""
        />
        <template v-if="optType !== 'view'">
          <template v-if="taskInfo.taskStatus === 20061001">
            <q-btn

              label="开始处理"
              icon="start"
              color="secondary"
              @click="handleProcess"
            />
          </template>
          <template v-else-if="taskInfo.taskStatus === 20061002">
            <q-btn
              label="自审完成"
              icon="check_circle"
              color="secondary"
              @click="handleProcess"
            />
          </template>
          <template v-else-if="taskInfo.taskStatus === 20061003">
          <q-btn
            label="审批"
            icon="rule"
            color="primary"
            @click="handleProcess"
          />
          </template>
          <template v-else-if="taskInfo.taskStatus === 20061004">
            <q-btn
              label="发送草稿"
              icon="forward_to_inbox"
              color="primary"
              @click="handleProcess"
            />
          </template>
          <template v-else-if="taskInfo.taskStatus === 20061005">
            <q-btn
              label="客户确认结果录入"
              icon="live_help"
              color="primary"
              @click="handleProcess"
            />
          </template>
          <template v-else-if="taskInfo.taskStatus === 20061006">
            <q-btn
              label="自审完成"
              icon="check_circle"
              color="primary"
              @click="handleProcess"
            />
          </template>
          <template v-else-if="taskInfo.taskStatus === 20061007">
            <q-btn
              label="申报"
              icon="cloud_upload"
              color="primary"
              @click="handleProcess"
            />
          </template>
          <template v-else-if="taskInfo.taskStatus === 20061008">
            <q-btn
              label="重新处理"
              icon="move_up"
              color="primary"
              @click="handleProcess"
            />
          </template>
        </template>
        <q-btn
          label="返回"
          icon="reply"
          color="grey"
          @click="cancel"
        />
      </div>
      <div class="row q-gutter-md">
        <q-timeline layout="loose" color="primary">
          <q-timeline-entry heading>
            {{ taskInfo.taskName }}
          </q-timeline-entry>
          <q-timeline-entry
            title="任务创建"
            icon="flag_circle"
            :subtitle="dateFormatter(taskInfo.createDate)"
          >
          </q-timeline-entry>
          <q-timeline-entry
            v-for="tp in taskProcess"
            :key="tp?.processId"
            :side="tp?.optBy === store.getId ? 'right' : 'left'"
            :title="fixcodeTranslate(tp?.taskStatusTo)"
            :subtitle="dateFormatter(tp?.optDate)"
            :avatar="loadUrl + `generate/loadImage?filePath=${tp?.avatar}`"
          >
            <div>
              操作人: {{ tp?.optName }}
            </div>
            <div v-if="!tp?.fileId">
              备注: <span v-html = 'tp?.comment ? tp?.comment : "无"'></span>
            </div>
            <div v-else>
              附件 : <a :href="downloadPath + tp?.filePath + '&actualFileName=' + tp?.fileName">{{ tp?.fileName }}</a>
            </div>
          </q-timeline-entry>
        </q-timeline>
      </div>
<!--      <div class="row q-gutter-md">-->
<!--        <div class="col-md-4 col-xs-12 q-pb-lg">-->
<!--          <AttachmentUploader-->
<!--            label="请上传客户资料"-->
<!--            v-model:model="taskInfo.docFilePath"-->
<!--            :task-id="taskInfo.taskId"-->
<!--            :attachment-type="1"-->
<!--          />-->
<!--        </div>-->
<!--        <div class="col-md-4 col-xs-12 q-pb-lg">-->
<!--          <AttachmentUploader-->
<!--            label="请上传银行票据"-->
<!--            v-model:model="taskInfo.bankNotesFile"-->
<!--            :task-id="taskInfo.taskId"-->
<!--            :attachment-type="2"-->
<!--          />-->
<!--        </div>-->
<!--      </div>-->
    </div>
    <ProcessHandleForm
      v-model:model="showEditor"
      :task-id="taskInfo.taskId"
      :task-info="taskInfo"
      :opt-type="optType"
      :process-status="taskInfo.taskStatus"
      :reset="resetRole"
      :invoke="'refreshList'"
      @refreshList="getTaskAndProcess"
     />
  </q-page>
</template>

<script setup lang="ts">
import { computed, onBeforeMount, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { fetchTaskInfo, fetchTaskProcessList } from 'src/api/taskmanager';
import { TaskInfo, TaskProcess } from 'src/models/taskmanager-model';
import FixcodeSelect from 'components/FixcodeSelect/index.vue';
import { date } from 'quasar';
import { getfixCodeDesc } from 'src/utils/fixcode';
import { useUserStore } from 'stores/user';
import ProcessHandleForm from 'pages/taskmanager/components/ProcessHandleForm.vue';

const taskId = ref(null)
const optType = ref('')
const downloadPath = ref('')
const taskInfo = ref<TaskInfo>({
  taskId: null,
  taskName: null,
  clientName: null,
  clientType: '',
  clientEmail: null,
  clientMobile: null,
  clientTel: null,
  optName: null,
  approveName: null,
  taskType: '',
  taskStatus: '',
  createDate: null,
})

const showEditor = ref(false)
const store = useUserStore();
const taskProcess = ref<TaskProcess>([])
const loadUrl = computed({
  get() {
    return process.env.API
  }
})

const route = useRoute()
// const router = useRouter()
onBeforeMount(() => {
  downloadPath.value = process.env.API + 'generate/streamingDownload?filePath='
  taskId.value = route.params.id
  optType.value = route.params.type
  getTaskAndProcess()
})

const getTaskInfo = () => {
  fetchTaskInfo(taskId.value).then(response => {
    taskInfo.value.taskId = response.data.taskId
    taskInfo.value.clientName = response.data.clientName
    taskInfo.value.clientType = response.data.clientType
    taskInfo.value.clientEmail = response.data.clientEmail
    taskInfo.value.clientMobile = response.data.clientMobile
    taskInfo.value.clientTel = response.data.clientTel
    taskInfo.value.optName = response.data.optName
    taskInfo.value.approveName = response.data.approveName
    taskInfo.value.taskType = '' + response.data.taskType
    taskInfo.value.taskStatus = response.data.taskStatus
    taskInfo.value.createDate = response.data.createDate
    taskInfo.value.taskName = response.data.taskName
  })
}
const getTaskAndProcess = () => {
  getTaskInfo()
  getTaskProcessList()
}
const getTaskProcessList = () => {
  fetchTaskProcessList(taskId.value).then(response => {
    console.log(response.data)
    taskProcess.value = response.data
  })
}
const dateFormatter = (val, format) => {
  if (!val) {
    return ''
  }
  return date.formatDate(val, format ? format : 'DD-MM-YYYY')
}

const fixcodeTranslate = (fixcode) => {
  if (!fixcode) {
    return ''
  }
  return getfixCodeDesc(fixcode)
}

const handleProcess = () => {
  showEditor.value = true
}

const router = useRouter()
const cancel = () => {
  router.back()
}

</script>
