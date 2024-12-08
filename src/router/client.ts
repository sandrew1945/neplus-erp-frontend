import { RouteRecordRaw } from 'vue-router'
// import { h as createElement } from 'vue'; // Import `h` for typing


const clientRouter: RouteRecordRaw = {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    redirect: 'noRedirect',
    name: '客户管理',
    children: [
      {
        path: 'client',
        name: 'Client',
        redirect: 'noRedirect',
        // component: {
        //   render (h: typeof createElement) { return h('router-view') }
        // },
        meta: { title: '客户管理', icon: 'thumb_up' },
        children: [
          {
            path: 'manager',
            name: 'clientlist',
            component: () => import('pages/clientmanager/client-list.vue'),
            meta: { title: '客户管理', icon: 'thumb_up' }
          }
        ]
      }
    ]
};

export default clientRouter;
