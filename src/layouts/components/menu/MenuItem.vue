<template>
  <div v-if="!item.meta.hidden">
    <template v-if="hasOneShowingChild(props.item.children, item)">
      <q-item
        :to="props.item.path"
        exact
        :dense="props.dense ? true : false"
        clickable
        v-ripple
        active-class="link-activated"
        :inset-level="0.5 * props.level"
      >
        <q-item-section avatar>
          <q-icon
            :class="$q.dark.isActive ? 'text-white':'text-black'"
            :name="extraIcon ? 'app:' + item.meta.icon : item.meta.icon"
          />
        </q-item-section>
        <q-item-section>
          {{ props.item.meta.title }}
        </q-item-section>
      </q-item>
    </template>
    <template v-else>
      <q-expansion-item
        expand-separator
        :dense-toggle="level > 0 ? true : false"
        :dense="dense ? true : false"
        :header-inset-level="0.5 * level"
        :icon="props.extraIcon ? 'app:' + props.item.meta.icon : props.item.meta.icon"
        :class="$q.dark.isActive ? 'text-white':'text-black'"
        :label="item.meta.title"
      >
        <MenuItem
          v-for="child in item.children"
          :item="child"
          :key="child.path"
          :level="level + 1"
          :extra-icon="props.extraIcon"
        />
      </q-expansion-item>
    </template>
  </div>

  
</template>

<script setup lang="ts">

  const props = defineProps({
    item: {
      type: Object,
      required: true
    },
    level: {
      type: Number,
      required: true,
      default: 0
    },
    dense: {
      type: Boolean,
      required: false,
      default: false
    },
    extraIcon: {
      type: Boolean,
      required: false
    }
  })

  // let onlyOneChild = null

  const hasOneShowingChild = (children = []) => {
    const showingChildren = children.filter(item => {
        if (item.meta.hidden) {
          return false
        } else {
          // Temp set(will be used if only has one showing child)
          // onlyOneChild = item
          return true
        }
      })

      // When there is only one child router, the child router is displayed by default
      if (showingChildren.length === 1) {
        return false
      }

      // Show parent if there are no child router to display
      if (showingChildren.length === 0) {
        // onlyOneChild = { ...parent, path: '', noShowingChildren: true }
        return true
      }
      return false
    }
</script>

<style lang="scss">
  .link-activated {
    color: white;
    background: $primary;
    opacity: 0.6;
  }
</style>
