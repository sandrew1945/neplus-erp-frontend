<template>
  <div :class="'column col-md-' + lg + ' col-sm-' + mid + ' col-xs-' + sm">
    <slot />
  </div>
</template>

<script>
export default {
  name: 'NContainer',
  props: {
    sm: {
      required: true,
      type: Number
    },
    mid: {
      required: true,
      type: Number
    },
    lg: {
      required: true,
      type: Number
    },
    dense: {
      required: false,
      type: Boolean
    }
  }
}
</script>

<style scoped>
</style>
