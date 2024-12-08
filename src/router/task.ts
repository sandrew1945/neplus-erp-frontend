import { RouteRecordRaw } from 'vue-router'
// import { h as createElement } from 'vue'; // Import `h` for typing


const taskRouter: RouteRecordRaw = {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    redirect: 'noRedirect',
    name: '任务管理',
    children: [
      {
        path: 'task',
        name: 'Task',
        redirect: 'noRedirect',
        // component: {
        //   render (h: typeof createElement) { return h('router-view') }
        // },
        meta: { title: '任务管理', icon: 'thumb_up' },
        children: [
          {
            path: 'manager',
            name: 'tasklist',
            component: () => import('pages/taskmanager/task-list.vue'),
            meta: { title: '客户管理', icon: 'thumb_up' }
          },
          {
            path: 'process/:id',
            name: 'Process',
            component: () => import('pages/taskmanager/task-procession-ragular.vue'),
            meta: { hidden: true }
            // hidden: true
          }
        ]
      }
    ]
};

export default taskRouter;
