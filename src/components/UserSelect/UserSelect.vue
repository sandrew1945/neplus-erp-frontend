<template>
  <q-select
    v-if="!clearable"
    :dense="dense"
    outlined
    v-model="selectedItem"
    :options="options"
    map-options
    option-value="key"
    option-label="value"
    emit-value
    :label="placeholder"
    :style="css"
    :rules="rules"
  />
  <q-select
    v-else
    :dense="dense"
    outlined
    v-model="selectedItem"
    :options="options"
    map-options
    option-value="userId"
    option-label="userName"
    emit-value
    :label="placeholder"
    :style="css"
    :rules="rules"
  >
    <template v-slot:append>
      <q-icon
        name="close"
        @click.stop="selectedItem = ''"
        class="cursor-pointer"
      />
    </template>
  </q-select>
</template>

<script setup lang="ts">
import { defineProps, onBeforeMount, ref, computed, defineEmits } from 'vue'
import type { Ref } from 'vue'
import { getUserListByRoleType } from 'src/api/usermanager';

const options: Ref<string[]> = ref([])

const props = defineProps({
  placeholder: {
    required: false,
    type: String,
    default: ''
  },
  model: {
    required: true,
    type: String
  },
  css: {
    required: false,
    type: String,
    default: ''
  },
  roletype: {
    required: false,
    type: String
  },
  clearable: {
    required: false,
    type: Boolean
  },
  rules: {
    required: false,
    type: Array,
    default: null
  },
  dense: {
    required: false,
    type: Boolean
  }
})


const emit = defineEmits(['update:model'])
const selectedItem = computed({
  get() {
    return props.model === 'null' ? '' : props.model
  },
  set(val) {
    emit('update:model', val)
  }
})


onBeforeMount(() => {
  getUserListByRoleType(props.roletype).then(response => {
    const { data } = response
    options.value = data
  })
})
</script>

<style scoped>
</style>
