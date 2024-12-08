<template>
  <q-page :class="$q.dark.isActive ? 'column bg-dark' : 'column bg-white'">
    <div
      class="col-10 q-ma-lg"
    >
      <div class="row">
        <div class="col-md-3 col-xs-12">
          <q-tree
            class="q-ma-md"
            ref="tree"
            :nodes="treeNodes"
            node-key="path"
            label-key="name"
            default-expand-all
            :selected="selected"
            @update:selected="handleSelected"
          >
            <template v-slot:default-header="prop">
              <div class="row items-center">
                <q-icon
                  :name="prop.node.icon || 'share'"
                  color="grey"
                  size="24px"
                  class="q-mr-sm"
                />
                <div class="text-weight-bold">
                  {{ prop.node.name + '(' + prop.node.funcOrder + ')' }}
                </div>
              </div>
            </template>
          </q-tree>
        </div>
        <div class="col-md-9 col-xs-12">
          <div class="row">
            <q-form
              :dense="$q.screen.lt.sm ? true : false"
              class="q-gutter-md q-ma-md col-md-6"
            >
              <q-input
                ref="nodePath"
                outlined
                :dense="$q.screen.lt.sm ? true : false"
                label="路径"
                v-model="node.path"
                :rules="[
                  val => val !== null && val !== '' || '请输入菜单路径',
                ]"
              />
              <q-input
                ref="icon"
                outlined
                :dense="$q.screen.lt.sm ? true : false"
                v-model="node.icon"
                label="图标"
                :rules="[
                  val => val !== null && val !== '' || '请输入图标代码',
                ]"
              />
              <q-input
                ref="name"
                outlined
                :dense="$q.screen.lt.sm ? true : false"
                v-model="node.name"
                label="菜单名"
                :rules="[
                  val => val !== null && val !== '' || '请输入菜单名',
                ]"
              />
              <q-input
                ref="funcOrder"
                outlined
                type="number"
                :dense="$q.screen.lt.sm ? true : false"
                v-model="node.funcOrder"
                label="菜单顺序"
                :rules="[
                  val => val !== null && val !== '' || '请输入数字格式的顺序',
                ]"
              />
              <div class="q-gutter-md">
                <q-btn
                  label="Update"
                  type="button"
                  color="primary"
                  icon="update"
                  @click="handleUpdate"
                />
                <q-btn
                  label="Delete"
                  type="button"
                  color="negative"
                  icon="delete"
                  @click="handleDelete"
                />
                <q-btn
                  label="Create"
                  type="button"
                  color="warning"
                  icon="add"
                  @click="handleCreate"
                />
              </div>
            </q-form>
          </div>
        </div>
        <MenuForm
          v-model:model="showCreate"
          :father-id="node.functionId"
          :father-path="node.path + '/'"
          :invoke="'refreshTree'"
          @refreshTree="fetchMenu"
          :reset="resetNode"
        />
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { getMenuTree, updateMenu, deleteMenu } from 'src/api/funcmanager'
import { successNotify, warningNotify } from 'src/utils/Notify'
import MenuForm from './components/MenuForm'
import { onBeforeMount, ref } from 'vue';

// const checkedNode = ref([])
// const checkMenu = ref([])
// const routes = ref([])
// const ticked = ref([])
const showCreate = ref(false)
const node = ref({
  functionId: '',
  path: '',
  name: '',
  title: '',
  icon: '',
  funcOrder: ''
})
const selected = ref('')
const treeNodes = ref([])
// const thumbStyle = {
//   right: '4px',
//   borderRadius: '5px',
//   backgroundColor: '#086491',
//   width: '10px',
//   opacity: 0.75
// }
// const barStyle = {
//   right: '2px',
//     borderRadius: '9px',
//     backgroundColor: 'primary',
//     width: '9px',
//     opacity: 0.2
// }

onBeforeMount(() => {
  fetchMenu()
})


const fetchMenu = () => {
  getMenuTree().then(res => {
    treeNodes.value = res.data
  })
}

const tree = ref(null)
const handleSelected = (key) => {
  if (key) {
    const memu = tree.value.getNodeByKey(key)
    if (memu) {
      node.value.functionId = '' + memu.functionId
      node.value.path = memu.path
      node.value.name = memu.name
      node.value.icon = memu.icon
      node.value.funcOrder = memu.funcOrder
    }
  } else {
    resetNode()
  }
}
const handleUpdate = () => {
  if (!node.value.functionId) {
    warningNotify('请选择一个菜单节点')
    return
  }
  updateMenu(node.value).then(res => {
    if (res.data > 0) {
      fetchMenu()
      successNotify('Update Successfully')
    }
  })
}

const handleDelete = () => {
  if (!node.value.functionId) {
    warningNotify('请选择一个菜单节点')
    return
  }
  deleteMenu({ functionId: node.value.functionId }).then(() => {
    fetchMenu()
    resetNode()
  })
}

const handleCreate = () => {
  showCreate.value = true
}

const resetNode = () => {
  new Promise((resolve) => {
    node.value = {
      functionId: null,
      path: '',
      name: '',
      title: '',
      icon: '',
      funcOrder: ''
    }
    resolve()
  }).then(() => {
    let nodePath = ref(null)
    let icon = ref(null)
    let name = ref(null)
    let funcOrder = ref(null)
    nodePath.value.resetValidation()
    icon.value.resetValidation()
    name.value.resetValidation()
    funcOrder.value.resetValidation()
  })
}

</script>
