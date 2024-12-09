<template>
  <q-uploader
    auto-upload
    v-model="filePath"
    :label="props.label"
    :factory="doUpdate"
    dense
    field-name="file"
    accept=".jpg, image/*"
    :style="style"
  >
    <template v-slot:list="">
      <q-avatar rounded size="190px">
        <img v-if="!filePath" :src="placeholder">
        <img v-else :src="suffix">
      </q-avatar>
    </template>
  </q-uploader>
</template>

<script setup lang="ts">
import { defineProps, computed, defineEmits } from 'vue'
import { uploadAttachment } from 'src/api/taskmanager';

const props = defineProps({
  placeholder: {
    required: false,
    type: String,
    default: 'upload.png'
  },
  model: {
    required: true,
    type: String,
    default: ''
  },
  style: {
    required: false,
    type: String,
    default: 'width: 200px'
  },
  label: {
    required: false,
    type: String,
    default: 'Choose attachment'
  }
})

// const options = ref<string[]>([])

const emit = defineEmits(['update:model'])
const filePath = computed({
  get() {
    return props.model
  },
  set(val) {
    emit('update:model', val)
  }
})
const suffix = computed({
  get() {
    console.log('suffix ====>' + props.model.value)
    return props.model.value.split('.').pop().toLowerCase() + '.png'
  }
})
const doUpdate = (files) => {
  new Promise((resolve) => {
    const file = files[0]
    let fileSrc
    let fileData

    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onerror = err => console.error(`Failed to read file: ${err}`)
    reader.onload = function () {
      fileSrc = reader.result
      fileData = fileSrc.substr(fileSrc.indexOf(',') + 1)
      const formData = new FormData()
      formData.append('base64file', fileData)
      formData.append('filename', file.name)
      uploadAttachment(formData).then(res => {
        resolve(res)
      })
    }
  }).then(res => {
    // this.avatarUrl = process.env.API + '/generate/loadImage?filePath=' + res.data
    filePath.value = res.data
    surffix.value = filePath.value.split('.').pop().toLowerCase() + '.png'
    console.log('--------->' + surffix.value)
  })
}

</script>

<style scoped>
</style>
