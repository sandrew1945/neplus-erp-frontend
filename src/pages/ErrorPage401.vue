<template>
  <div class="fullscreen bg-blue text-white text-center q-pa-md flex flex-center">
    <div>
      <div style="font-size: 30vh">
        401
      </div>

      <div
        class="text-h2"
        style="opacity:.4"
      >
        Oops. You don't have access to the system
      </div>

      <q-btn
        class="q-mt-xl"
        color="white"
        text-color="blue"
        unelevated
        @click="logout"
        label="Re-Login"
        no-caps
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from 'stores/user';
import { useRoute, useRouter } from 'vue-router';

const store = useUserStore()
const router = useRouter()
const route = useRoute()
const logout = async () => {
  await store.logout()
  router.push(`/login?redirect=${route.fullPath}`)
}

// export default {
//   name: 'ErrorPage401',
//   methods: {
//     async logout () {
//       await this.$store.dispatch('user/logout')
//       this.$router.push(`/login?redirect=${route.fullPath}`)
//     }
//   }
// }

</script>
