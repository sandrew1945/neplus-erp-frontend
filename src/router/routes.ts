import { RouteRecordRaw } from 'vue-router';
import permissionRouter from './premission'
import clientRouter from './client'
import taskRouter from './task'

const routes: RouteRecordRaw[] = [
  // {
  //   path: '/',
  //   component: () => import('layouts/MainLayout.vue'),
  //   children: [{ path: '', component: () => import('pages/IndexPage.vue') }],
  // },
  {
    path: '/login',
    component: () => import('pages/login/LoginIndex.vue'),
    meta: { hidden: true }
    // hidden: true
  },
  {
    path: '/role',
    component: () => import('pages/login/RoleTable.vue'),
    meta: { hideen: true}
    // hidden: true
  },
  {
    path: '/index',
    alias: '/',
    component: () => import('layouts/MainLayout.vue'),
    redirect: 'noRedirect',
    children: [
      {
        path: 'dashboard',
        name: 'dashboard',
        alias: '',
        component: () => import('pages/TodoPage.vue'),
        meta: { title: '系统首页', icon: 'home' }
      }
    ]
  },
  {
    path: '/401',
    component: () => import('pages/ErrorPage401.vue'),
    meta: { hidden: true }
    // hidden: true
  },
  clientRouter,
  taskRouter,
  permissionRouter,
  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)',
    component: () => import('pages/ErrorPage404.vue'),
    meta: { hidden: true }
    // hidden: true
  }
];

export default routes;
