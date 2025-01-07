<template>
  <q-select
    v-if="!clearable"
    :dense="dense"
    outlined
    :multiple="multiple"
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
    :multiple="multiple"
    v-model="selectedItem"
    :options="options"
    map-options
    option-value="key"
    option-label="value"
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
import { getSelectOption } from 'src/utils/fixcode'

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
  fixcodetype: {
    required: true,
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
  },
  multiple: {
    required: false,
    type: Boolean,
    default: false
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
  // get: () => (props.model === 'null' ? '' : props.model),
  // set: (val) => emit('update:model', val)
})


onBeforeMount(() => {
  options.value = getSelectOption(props.fixcodetype)
})
</script>

<style scoped>
</style>
