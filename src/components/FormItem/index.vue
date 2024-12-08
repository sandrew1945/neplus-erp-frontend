<template>
  <div class="row q-gutter-y-sm items-center">
    <span
      :class="$q.screen.gt.xs ? 'col-md-' + labelLg + ' col-sm-' + labelMid + ' col-xs-12 justify-end: true' : 'col-md-' + labelLg + ' col-sm-' + labelMid + ' col-xs-' + labelSm + ' col-xs-12 justify-end: false'"
      style="margin-top: -10px"
    >
      <q-item-label
        class="q-pr-md"
        :class="{ 'text-right': $q.screen.gt.xs }"
      >{{ title }}:</q-item-label>
    </span>
    <span :class="'col-md-' + (12 - labelLg) + ' col-sm-' + (12 - labelMid) + ' col-xs-12'">
      <q-item-label>
        <slot />
      </q-item-label>
    </span>
  </div>
</template>

<script>
export default {
  name: 'FormItem',
  props: {
    labelMid: {
      required: true,
      type: Number
    },
    labelLg: {
      required: true,
      type: Number
    },
    title: {
      required: true,
      type: String
    }
  }
}
</script>

<style scoped>
</style>
