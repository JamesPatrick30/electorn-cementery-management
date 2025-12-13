import { createRouter, createWebHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';
import login from '../views/login.vue';
import home from '../views/app/Home.vue';

import map from '../views/app/childer/map.vue';
import Dashboard from '../views/app/childer/Dashboard.vue';
const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'login',
    component: login
  },
  {
    path: '/home',
    name: 'home',
    component: home,
    children: [
      {
        path: 'dashboard',
        name: 'dashboard',
        component: Dashboard
      },
      {
        path: 'map',
        name: 'map',
        component: map
      }
    ]
  },
  // {
  //   path: '/about',
  //   name: 'About',
  //   component: About
  // },
  // {
  //   path: '/:pathMatch(.*)*', // 404 fallback
  //   name: 'NotFound',
  //   component: () => import('../views/NotFound.vue') // lazy-loaded
  // }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});

export default router;
