import { RouteRecordRaw } from 'vue-router'
// import { h as createElement } from 'vue'; // Import `h` for typing


const taskRouter: RouteRecordRaw = {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    redirect: 'noRedirect',
    name: '邮件模版管理',
    children: [
      {
        path: 'mail',
        name: 'Mail',
        redirect: 'noRedirect',
        // component: {
        //   render (h: typeof createElement) { return h('router-view') }
        // },
        meta: { title: '邮件模版管理', icon: 'mail' },
        children: [
          {
            path: 'template',
            name: 'Template',
            component: () => import('pages/mailmanager/Template.vue'),
            meta: { title: '邮件模版管理', icon: 'mail' }
          }
          // {
          //   path: 'process/:id/:type',
          //   name: 'Process',
          //   component: () => import('pages/taskmanager/task-procession-ragular.vue'),
          //   meta: { hidden: true }
          //   // hidden: true
          // }
        ]
      }
    ]
};

export default taskRouter;
