<template>
  <q-page-container>
<!--    <transition-->
<!--      appear-->
<!--      enter-active-class="animated fadeIn"-->
<!--      leave-active-class="animated fadeOut"-->
<!--    >-->
<!--      <router-view />-->
<!--    </transition>-->
    <router-view v-slot="{ Component }">
      <transition appear enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">
        <component :is="Component" />
      </transition>
    </router-view>
    <q-page-sticky
      position="bottom-right"
      :offset="fabPos"
    >
      <q-fab
        v-model="showFloat"
        vertical-actions-align="left"
        color="primary"
        glossy
        :disable="draggingFab"
        icon="keyboard_arrow_up"
        direction="up"
        v-touch-pan.prevent.mouse="handleStickyMove"
      >
        <q-fab-action
          color="primary"
          icon="open_in_new"
          @click="logout"
        >
          <q-tooltip
            anchor="center left"
            self="center right"
            :offset="[10, 10]"
          >
            登出系统
          </q-tooltip>
        </q-fab-action>
        <!-- <q-fab-action
          color="primary"
          icon="lock"
        >
          <q-tooltip
            anchor="center left"
            self="center right"
            :offset="[10, 10]"
          >
            锁定系统
          </q-tooltip>
        </q-fab-action> -->
        <q-fab-action
          v-if="store.getRoles.length > 1"
          color="primary"
          icon="swap_calls"
          @click="reSelectRole"
        >
          <q-tooltip
            anchor="center left"
            self="center right"
            :offset="[10, 10]"
          >
            切换角色
          </q-tooltip>
        </q-fab-action>
        <q-fab-action
          color="primary"
          icon="equalizer"
          @click="profile"
        >
          <q-tooltip
            anchor="center left"
            self="center right"
            :offset="[10, 10]"
          >
            个人信息
          </q-tooltip>
        </q-fab-action>
      </q-fab>
    </q-page-sticky>
  </q-page-container>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useUserStore } from 'stores/user';

const showFloat = ref(false)
const draggingFab = ref(false)
const fabPos = ref([18, 18])


const route = useRoute()
const router = useRouter()
computed({
  key() {
    return route.path
  }
})

const store = useUserStore()
const logout = async() => {
  await store.logout()
  router.push(`/login?redirect=${route.fullPath}`)
}

const reSelectRole = () => {
  store.resetSelectedRole()
  router.push('/role')
}

const profile = () => {
  router.push('/profile')
}

const handleStickyMove = (evt) => {
  draggingFab.value = evt.isFirst !== true && evt.isFinal !== true
  fabPos.value = [
    fabPos.value[0] - evt.delta.x,
    fabPos.value[1] - evt.delta.y
  ]
}
</script>
