<!--
  说明：新增/修改用户信息组件。
  使用方法：引用组件，然后如下实用：

    <ProcessHandleForm
      v-model:model="showEditor"
      task-id="1"
      process-status="20061001"
      :reset="reset"
      :invoke="'refreshList'"
      @refreshList="getList"
    />
  invoke中的方法名与后面@getSelected要一致，不指定则默认为getList，其中getList为父组件定义的方法
  multi表示是否支持多选

  getList: function(data) {
    console.log(JSON.stringify(data))
  }
-->

<template>
  <StickDialog
    v-model:model="showDialog"
    position="top"
  >
    <q-card style="width: 900px; max-width: 80vw;">
      <q-toolbar>
        <q-avatar>
          <img src="https://cdn.quasar.dev/logo/svg/quasar-logo.svg">
        </q-avatar>
        <q-toolbar-title><b>客户账务处理</b></q-toolbar-title>
        <q-btn
          flat
          round
          dense
          icon="close"
          v-close-popup
        />
      </q-toolbar>
      <q-card-section>
        <q-form
          ref="processForm"
          @reset="reset"
          class="q-gutter-md"
        >
          <div class="row" v-if="props.processStatus === 20061004 || props.processStatus === 20061007">
            <q-input
              dense
              outlined
              v-model="taskInfo.clientEmail"
              readonly
              label="客户邮箱"
              class="col-md-12 col-xs-12"
            />
          </div>
          <div class="row justify-between">
            <div v-if="props.processStatus === 20061004" class="col-4">
              <AttachmentUploader
                label="请上传"
                v-model:model="fileId"
              />
            </div>
            <div :class="props.processStatus === 20061004 ? 'col-8' : 'col-12'">
              <q-editor v-model="comment" placeholder="请输入意见" min-height="15rem" />
            </div>
          </div>
          <div class="row">
            <template v-if="props.processStatus === 20061001">
            <q-btn
              icon="start"
              label="开始处理"
              type="button"
              color="primary"
              @click="handleStart"
            />
            </template>
            <template v-else-if="props.processStatus === 20061002">
            <q-btn
              label="自审完成"
              type="button"
              icon="check_circle"
              color="primary"
              @click="handleSelfApproved"
            />
            </template>
            <template v-else-if="props.processStatus === 20061003">
            <div class="row q-gutter-md">
            <q-btn
              label="通过"
              icon="check_circle"
              type="button"
              color="primary"
              @click="handleApproved"
            />
            <q-btn
              label="驳回"
              icon="swipe_left"
              type="button"
              color="negative"
              @click="handleInnerReject"
            />
            </div>
            </template>
            <template v-else-if="props.processStatus === 20061006">
              <q-btn
                label="自审完成"
                type="button"
                icon="check_circle"
                color="primary"
                @click="handleSelfApproved"
              />
            </template>
            <template v-else-if="props.processStatus === 20061004">
              <q-btn
                label="发送草稿"
                icon="forward_to_inbox"
                color="primary"
                @click="handleDraftSent"
              />
            </template>
            <q-btn
              label="Reset"
              type="reset"
              color="grey"
              flat
              class="q-ml-sm"
            />

          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </StickDialog>
</template>

<script setup lang="ts">
import StickDialog from 'src/components/Dialog/StickDialog.vue'
import { successNotify, warningNotify } from 'src/utils/Notify'
import { computed, ref, nextTick } from 'vue';
import AttachmentUploader from 'src/components/AttachmentUploader/AttachmentUploader.vue'
import {
  makeTaskApproved,
  makeTaskDraftSent,
  makeTaskInnerReject,
  makeTaskSelfApproved,
  makeTaskStart
} from 'src/api/taskmanager';

const props = defineProps({
  model: {
    required: true,
    type: Boolean
  },
  invoke: {
    required: true,
    type: String,
    default: 'getList'
  },
  processStatus: {
    required: true,
    type: Number
  },
  taskId: {
    required: true,
    type: Number,
  }
})
const fileId = ref<number>(null)
const comment = ref<string>(null)
const emit = defineEmits(['update:model', 'refreshList'])
const showDialog = computed({
  get() {
    return props.model
  },
  set(val) {
    emit('update:model', val)
  }
})

const taskInfo = defineModel('taskInfo')
const processForm = ref(null)

const clearForm = () => {
  comment.value = null
  fileId.value = null

}

const handleStart = () => {
  processForm.value.validate().then(success => {
    if (success) {
      makeTaskStart({'taskId': props.taskId, 'comment': comment.value, 'fileId': fileId.value}).then(() => {
        successNotify('Update Successfully')
        nextTick(() => {
          // props.reset()
          showDialog.value = false
          clearForm()
          emit(props.invoke)
        })
      })
    } else {
      warningNotify('请完善表单信息')
    }
  })
}
const handleSelfApproved = () => {
  processForm.value.validate().then(success => {
    if (success) {
      makeTaskSelfApproved({'taskId': props.taskId, 'comment': comment.value, 'fileId': fileId.value}).then(() => {
        successNotify('Update Successfully')
        nextTick(() => {
          // props.reset()
          showDialog.value = false
          clearForm()
          emit(props.invoke)
        })
      })
    } else {
      warningNotify('请完善表单信息')
    }
  })
}

const handleApproved = () => {
  processForm.value.validate().then(success => {
    if (success) {
      makeTaskApproved({'taskId': props.taskId, 'comment': comment.value, 'fileId': fileId.value}).then(() => {
        successNotify('Update Successfully')
        nextTick(() => {
          // props.reset()
          showDialog.value = false
          clearForm()
          emit(props.invoke)
        })
      })
    } else {
      warningNotify('请完善表单信息')
    }
  })
}

const handleInnerReject = () => {
  processForm.value.validate().then(success => {
    if (success) {
      makeTaskInnerReject({'taskId': props.taskId, 'comment': comment.value, 'fileId': fileId.value}).then(() => {
        successNotify('Update Successfully')
        nextTick(() => {
          // props.reset()
          showDialog.value = false
          clearForm()
          emit(props.invoke)
        })
      })
    } else {
      warningNotify('请完善表单信息')
    }
  })
}

const handleDraftSent = () => {
  processForm.value.validate().then(success => {
    if (success) {
      if (!fileId.value)
      {
        warningNotify('请上传申报单草稿')
        return
      }
      makeTaskDraftSent({'taskId': props.taskId, 'comment': comment.value, 'fileId': fileId.value}).then(() => {
        successNotify('Update Successfully')
        nextTick(() => {
          // props.reset()
          showDialog.value = false
          clearForm()
          emit(props.invoke)
        })
      })
    } else {
      warningNotify('请完善表单信息')
    }
  })
}
</script>
