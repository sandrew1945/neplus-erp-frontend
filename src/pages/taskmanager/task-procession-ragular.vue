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
<!--        <q-btn-->
<!--          label="保存权限"-->
<!--          icon="grading"-->
<!--          color="primary"-->
<!--          @click="handleSave"-->
<!--        />-->
<!--        <q-btn-->
<!--          label="返回"-->
<!--          icon="reply"-->
<!--          color="grey"-->
<!--          @click="cancel"-->
<!--        />-->
      </div>
      <div class="row q-gutter-md">
        <q-timeline layout="loose" color="secondary">
          <q-timeline-entry heading>
            税务申报
          </q-timeline-entry>

          <q-timeline-entry
            title="账务处理"
            subtitle="01/12/2024"
          >
            <div>
              备注: 无
            </div>
          </q-timeline-entry>

          <q-timeline-entry
            title="自审完成"
            subtitle="12/12/2024"
            icon="delete"
          >
            <div>
              备注: 无
            </div>
          </q-timeline-entry>
          <q-timeline-entry
            title="内部驳回"
            side="left"
            subtitle="14/12/2024"
            avatar="https://cdn.quasar.dev/img/avatar2.jpg"
          >
            <div>
              备注: 客户资料有更新
            </div>
          </q-timeline-entry>

          <q-timeline-entry
            title="自审完成"
            subtitle="15/12/2024"
          >
            <div>
              备注: 已根据客户最新资料进行修改
            </div>
          </q-timeline-entry>

          <q-timeline-entry
            title="审批通过"
            subtitle="16/12/2024"
            color="orange"
            side="left"
            icon="done_all"
          >
            <div>
              备注: 无
            </div>
          </q-timeline-entry>

          <q-timeline-entry
            title="草稿发送"
            subtitle="17/12/2024"
          >
            <div>
              备注: 无
            </div>
          </q-timeline-entry>

          <q-timeline-entry
            title="等待申报"
            subtitle="24/12/20246"
          >
            <div>
              备注: 无
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
      <div class="row q-gutter-md justify-end">
        <div class="col-md-5">
        <q-btn
          label="自审"
          icon="grading"
          color="primary"
          @click="handleSave"
        />
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { onBeforeMount, ref } from 'vue';
import { useRoute } from 'vue-router';
import { fetchTaskInfo } from 'src/api/taskmanager';
import { TaskInfo } from 'src/models/taskmanager-model';
import FixcodeSelect from 'components/FixcodeSelect/index.vue';

const taskId = ref(null)
// const treeNodes = ref([])
const taskInfo = ref<TaskInfo>({
  taskId: null,
  clientName: null,
  clientType: '',
  clientEmail: null,
  clientMobile: null,
  clientTel: null,
  optName: null,
  approveName: null,
  taskType: '',
  taskStatus: '',
  docFile: null,
  docFilePath: null,
  docArchiveDate: null,
  bankNotesFile: null,
  bankNotesArchiveDate: null,
  bankNotesPath: null,
  selfExamFile: null,
  selfExamArchiveDate: null,
  draftFile: null,
  draftCreateDate: null,
  dirRejDate: null,
  dirRejCmnt: null,
  cliRejDate: null,
  cliRejCmnt: null,
})



const route = useRoute()
// const router = useRouter()
onBeforeMount(() => {
  taskId.value = route.params.id
  getTaskInfo()
})

const getTaskInfo = () => {
  fetchTaskInfo(taskId.value).then(response => {
    console.log(JSON.stringify(response))
    taskInfo.value.taskId = response.data.taskId
    taskInfo.value.clientName = response.data.clientName
    taskInfo.value.clientType = response.data.clientType
    taskInfo.value.clientEmail = response.data.clientEmail
    taskInfo.value.optName = response.data.optName
    taskInfo.value.approveName = response.data.approveName
    taskInfo.value.taskType = '' + response.data.taskType
    taskInfo.value.taskStatus = response.data.taskStatus
    taskInfo.value.docFile = response.data.docFile
    taskInfo.value.docArchiveDate = response.data.docArchiveDate
    taskInfo.value.bankNotesFile = response.data.bankNotesFile
    taskInfo.value.bankNotesArchiveDate = response.data.bankNotesArchiveDate
    taskInfo.value.selfExamFile = response.data.selfExamFile
    taskInfo.value.selfExamArchiveDate = response.data.selfExamArchiveDate
    taskInfo.value.draftFile = response.data.draftFile
    taskInfo.value.draftCreateDate = response.data.draftCreateDate
    taskInfo.value.dirRejDate = response.data.dirRejDate
    taskInfo.value.dirRejCmnt = 'qwieqwneiqwehquiwehuqiwehquiwehquiwheuiqwehuqwehiuqwehiuqwe'//response.data.dirRejCmnt
    taskInfo.value.cliRejDate = response.data.cliRejCmnt
    taskInfo.value.cliRejCmnt = response.data.cliRejCmnt
  })
}

// const handleSave = () => {
//   const functionIdArray = []
//   ticked.value.forEach(key => {
//     const node = tree.value.getNodeByKey(key)
//     functionIdArray.push(node.functionId)
//   })
//   const params = { roleId: node.value.roleId, functionIds: functionIdArray }
//   saveSelectedFunc(params).then((response) => {
//     if (response.result === true) {
//       successNotify('Save Successfully')
//     }
//   })
// }
// const cancel = () => {
//   router.back(-1)
// }

</script>
