<template>
  <q-layout>
    <q-page-container>
      <q-page>
        <q-form ref="form" class="q-mx-auto">
          <div class="flex column">
            <div
              class="col text-center text-white"
              style="margin-top: 150px"
            >
              <h4 class="text-weight-bold">
                Quasar Admin模版
              </h4>
            </div>
            <div class="col">
              <div class="row justify-center">
                <n-container
                  :sm="10"
                  :mid="5"
                  :lg="3"
                >
                  <q-input
                    color="grey-12"
                    :bg-color="$q.dark.isActive ? 'blue-grey-14' : 'amber-1'"
                    v-model="loginForm.username"
                    clearable
                    outlined
                    placeholder="Username"
                    :rules="[
                      val => val !== null && val !== '' || 'Please type your username'
                    ]"
                  >
                    <template v-slot:prepend>
                      <q-icon name="account_circle" />
                    </template>
                  </q-input>
                </n-container>
              </div>
              <div class="row justify-center">
                <n-container
                  :sm="10"
                  :mid="5"
                  :lg="3"
                >
                  <q-input
                    v-model="loginForm.password"
                    color="grey-12"
                    :bg-color="$q.dark.isActive ? 'blue-grey-14' : 'amber-1'"
                    placeholder="Password"
                    outlined
                    :type="showPassword ? 'text' : 'password'"
                    @keyup.enter="handleLogin"
                    :rules="[
                      val => val !== null && val !== '' || 'Please type your password'
                    ]"
                  >
                    <template v-slot:prepend>
                      <q-icon name="lock" />
                    </template>
                    <template v-slot:append>
                      <q-icon
                        :name="showPassword ? 'visibility' : 'visibility_off'"
                        class="cursor-pointer"
                        @click="showPassword = !showPassword"
                      />
                    </template>
                  </q-input>
                </n-container>
              </div>
            </div>
            <div class="col">
              <div class="row justify-center">
                <n-container
                  :sm="10"
                  :mid="5"
                  :lg="3"
                >
                  <q-btn
                    class="q-mt-lg q-px-lg"
                    label="登 录"
                    type="button"
                    color="blue"
                    @click="handleLogin"
                  />
                </n-container>
              </div>
            </div>
          </div>
        </q-form>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
  import { ref } from 'vue';
  import { useQuasar } from 'quasar';
  import { useRouter } from 'vue-router';
  import NContainer from 'src/components/NContainer/index.vue'
  import { useUserStore } from 'src/stores/user'
  import { LoginForm } from 'src/models/login-model';

  const loginForm = ref<LoginForm>(
    {
      username: '',
      password: ''
    }
  )

  const showPassword = ref(false)
  const $q = useQuasar()
  const $router = useRouter()
  const form = ref(null)
  const handleLogin = () => {
    form.value.validate().then(success => {
      if (success) {
        $q.loading.show()
        const store = useUserStore()
        // 将 action 作为 store 的方法进行调用
        store.login(loginForm.value).then(() => {
          $router.push({ path: '/' })
          $q.loading.hide()
        }).catch(() => {
          $q.loading.hide()
        })
      }
    })
  }

</script>

<style lang="scss">
 .q-page {
   height: 100%;
  background: #2c3a4c; /* fallback for old browsers */
  //background: -webkit-linear-gradient(to top, #3a7bd5, #3a6073); /* Chrome 10-25, Safari 5.1-6 */
  //background: linear-gradient(to top, #2c3a4c, #2c3a4c); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
 }
</style>
