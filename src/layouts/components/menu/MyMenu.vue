<!--
  说明：
  menus: 菜单列表 格式: [{},{children:[{},{},{}]},{}]
  dense: 是否为紧凑模式

  示例:
  <MyMenu
    :menus="store.getMenuList"
    dense
  />
-->
<template>
  <q-scroll-area
    style="height: 100%; margin-top: 0px; border-right: 1px solid #ddd"
  >
    <q-list
      :dense="dense ? true : false"
      padding
    >
    <MenuItem
      v-for="item in props.menus"
      :item="item"
      :key="item.path"
      :level="0"
      :dense="props.dense"
      :extra-icon="props.extraIcon"
    />
    </q-list>
  </q-scroll-area>
</template>

<script setup lang="ts">
import MenuItem from './MenuItem'
  const props = defineProps({
    menus: {
      type: Array,
      required: true
    },
    dense: {
      type: Boolean,
      required: false,
      default: false
    },
    extraIcon: {
      type: Boolean,
      required: false,
      default: false
    }
  })

</script>
