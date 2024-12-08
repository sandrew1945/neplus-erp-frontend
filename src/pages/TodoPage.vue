<template>
  <q-page :class="this.$q.dark.isActive ? 'dark column' : 'bg-grey-3 column'">
    <div :class="this.$q.dark.isActive ? 'row q-pa-sm bg-dark' : 'row q-pa-sm bg-primary'">
      <q-input
        class="col"
        square
        v-model="taskName"
        bg-color="white"
        label=" Add task"
        dense
        @keyup.enter="addTask"
      >
        <template v-slot:append>
          <q-btn
            round
            dense
            flat
            icon="add"
            @click="addTask"
          />
        </template>
      </q-input>
    </div>
    <q-list
      class="bg-white"
      separator
      bordered
    >
      <q-item
        v-for="(task, index) in tasks"
        :key="task.title"
        v-ripple
        @click="task.done = !task.done"
        clickable
        :class="{ 'done bg-blue-1' : task.done }"
      >
        <q-item-section avatar>
          <q-checkbox
            v-model="
              task.done"
            class="no-pointer-events"
            color="primary"
          />
        </q-item-section>
        <q-item-section>
          <q-item-label>{{ task.title }}</q-item-label>
        </q-item-section>
        <q-item-section
          v-if="task.done"
          side
        >
          <q-btn
            flat
            round
            dense
            color="primary"
            icon="delete"
            @click.stop="deleteTask(index)"
          />
        </q-item-section>
      </q-item>
    </q-list>
    <div
      v-if="!tasks.length"
      class="no-tasks absolute-center"
    >
      <q-icon
        name="check"
        size="100px"
        color="primary"
      />
      <div class="text-h5 text-primary text-center">
        No Tasks
      </div>
    </div>
  </q-page>
</template>

<script>
import { getMenuByRole } from 'src/api/user'

export default {
  data () {
    return {
      tasks: [],
      taskName: '',
      warehouseIcon: ''
    }
  },
  methods: {
    deleteTask (index) {
      this.$q.dialog({
        title: '警告',
        message: '确认删除任务?',
        cancel: true,
        persistent: true
      }).onOk(() => {
        this.tasks.splice(index, 1)
        console.log('start request1')
        getMenuByRole(this.$store.getters['user/getRole']).then(res => {
          console.log(JSON.stringify(res))
        })
        console.log('end request1')
        this.$q.notify({
          message: '任务已经删除',
          color: 'Primary'
        })
      })
    },
    addTask () {
      if (this.taskName) {
        this.tasks.push({ title: this.taskName, done: false })
        this.taskName = ''
      }
    }
  }
}
</script>

<style lang="scss">
  .done {
    .q-item__label {
      text-decoration: line-through;
      color: #bbb;
    }
  }
  .no-tasks {
    opacity: 0.5;
  }
</style>
