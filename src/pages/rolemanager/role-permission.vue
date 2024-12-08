<template>
  <q-page :class="$q.dark.isActive ? 'column bg-dark' : 'column bg-white'">
    <div class="col-2 q-ma-lg q-gutter-md">
      <div class="row q-gutter-md">
        <q-input
          dense
          v-if="$q.screen.gt.xs"
          outlined
          v-model="roleInfo.roleCode"
          readonly
          placeholder="角色代码"
          class="col-md-2 col-xs-4"
        />
        <q-input
          dense
          outlined
          v-model="roleInfo.roleName"
          readonly
          placeholder="角色名称"
          class="col-md-2 col-xs-6"
        />
        <q-btn
          label="保存权限"
          icon="grading"
          color="primary"
          @click="handleSave"
        />
        <q-btn
          label="返回"
          icon="reply"
          color="grey"
          @click="cancel"
        />
      </div>
    </div>
    <div
      class="col-10 q-ma-lg"
    >
      <div class="row">
        <div class="col-md-6 col-xs-12">
          <q-tree
            class="q-ma-md"
            ref="tree"
            v-model:nodes="treeNodes"
            node-key="functionId"
            label-key="name"
            tick-strategy="leaf"
            v-model:ticked="ticked"
            default-expand-all
          />
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { fetchRoleInfo, saveSelectedFunc, getCheckedPremission } from 'src/api/rolemanager'
import { getMenuTree } from 'src/api/funcmanager'
import { successNotify } from 'src/utils/Notify'
import _ from 'lodash'
import { onBeforeMount, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const roleInfo = ref({})
const ticked = ref([])
const node = ref({
  roleId: '',
  fatherPath: '',
  fatherTitle: '',
  path: '',
  name: '',
  title: '',
  icon: ''
})
const treeNodes = ref([])

const route = useRoute()
const router = useRouter()
onBeforeMount(() => {
  node.value.roleId = route.params.id
  getRoleInfo()
  fetchMenu()
  initPremission()
})

const getRoleInfo = () => {
  fetchRoleInfo(node.value.roleId).then(response => {
    roleInfo.value = response.data
  })
}
const fetchMenu = () => {
  getMenuTree().then(res => {
    treeNodes.value = res.data
  })
}
const initPremission = () => {
  getCheckedPremission(node.value.roleId).then((response) => {
    ticked.value = _.concat(ticked.value, response.data)
  })
}

const tree = ref(null)
const handleSave = () => {
  const functionIdArray = []
  ticked.value.forEach(key => {
    const node = tree.value.getNodeByKey(key)
    functionIdArray.push(node.functionId)
  })
  const params = { roleId: node.value.roleId, functionIds: functionIdArray }
  saveSelectedFunc(params).then((response) => {
    if (response.result === true) {
      successNotify('Save Successfully')
    }
  })
}
const cancel = () => {
  router.back(-1)
}

</script>
