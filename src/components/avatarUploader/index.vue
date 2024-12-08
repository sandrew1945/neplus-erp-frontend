<template>
  <q-uploader
    auto-upload
    v-model="avatar"
    :factory="updateAvatar"
    field-name="file"
    accept=".jpg, image/*"
    style="width: 150px"
  >
    <template v-slot:list="">
      <q-avatar rounded size="140px">
        <img v-if="!avatar" :src="placeholder">
        <img v-else :src="loadUrl + avatar">
      </q-avatar>
    </template>
  </q-uploader>
</template>

<script setup lang="ts">
import { defineProps, computed, defineEmits } from 'vue'
import { uploadAvatar } from 'src/api/usermanager'

const props = defineProps({
  placeholder: {
    required: false,
    type: String,
    default: 'avatar.jpg'
  },
  model: {
    required: true,
    type: String
  },
  loadUrl: {
    required: false,
    type: String,
    default: ''
  }
})

// const options = ref<string[]>([])

const emit = defineEmits(['update:model'])
const avatar = computed({
  get() {
    return props.model
  },
  set(val) {
    emit('update:model', val)
  }
})


const updateAvatar = (files) => {
  new Promise((resolve) => {
    var file = files[0]
    var fileSrc
    var fileData

    var reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onerror = err => console.error(`Failed to read file: ${err}`)
    reader.onload = function () {
      fileSrc = reader.result
      fileData = fileSrc.substr(fileSrc.indexOf(',') + 1)
      const formData = new FormData()
      formData.append('base64file', fileData)
      formData.append('filename', file.name)
      uploadAvatar(formData).then(res => {
        resolve(res)
      })
    }
  }).then(res => {
    // this.avatarUrl = process.env.API + '/generate/loadImage?filePath=' + res.data
    avatar.value = res
  })
}

</script>

<style scoped>
</style>
