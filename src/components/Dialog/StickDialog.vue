<template>
  <q-dialog
    v-model="showDialog"
    :position="position"
    transition-show="rotate"
    transition-hide="rotate"
  >
    <slot />
  </q-dialog>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, computed, emit } from 'vue'

const props = defineProps({
  position: {
    required: false,
    type: String,
    default: 'top'
  },
  model: {
    required: true,
    type: Boolean
  }
})

const emit = defineEmits(['update:model'])
const showDialog = computed({
  get() {
    return props.model
  },
  set(val) {
    emit('update:model', val)
  }
})
</script>
