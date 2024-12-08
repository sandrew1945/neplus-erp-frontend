import { RouteRecordRaw } from 'vue-router'
// import { h as createElement } from 'vue'; // Import `h` for typing


const permissionRouter: RouteRecordRaw = {
    path: '/perm',
    component: () => import('layouts/MainLayout.vue'),
    redirect: 'noRedirect',
    name: '权限管理',
    children: [
      {
        path: 'user',
        name: 'User',
        redirect: 'noRedirect',
        // component: {
        //   render (h: typeof createElement) { return h('router-view') }
        // },
        meta: { title: '用户管理', icon: 'user2' },
        children: [
          {
            path: 'manager',
            name: 'userlist',
            component: () => import('pages/usermanager/user-list.vue'),
            meta: { title: '用户管理', icon: 'user2' }
          },
          {
            path: 'roles/:id',
            name: 'manageroles',
            component: () => import('pages/usermanager/user-roles.vue'),
            meta: { hidden: true }
            // hidden: true
          }
        ]
      },
      {
        path: 'role',
        name: 'Role',
        // component: {
        //   render (h: typeof createElement) { return h('router-view') }
        // },
        children: [
          {
            path: 'manager',
            name: 'rolelist',
            component: () => import('pages/rolemanager/role-list.vue'),
            meta: { title: '角色管理', icon: 'role' }
          },
          {
            path: 'permission/:id',
            name: 'permission',
            component: () => import('pages/rolemanager/role-permission.vue'),
            meta: { hidden: true }
            // hidden: true
          }
        ]
      },
      {
        path: 'function',
        name: 'Function',
        // component: {
        //   render (h: typeof createElement) { return h('router-view') }
        // },
        children: [
          {
            path: 'manager',
            name: 'function',
            component: () => import('pages/funcmanager/function-mng.vue'),
            meta: { title: '菜单管理', icon: 'role' }
          }
        ]
      }
    ]
};

export default permissionRouter;
