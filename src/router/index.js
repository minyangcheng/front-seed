import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '地图', icon: 'dashboard' }
    }]
  }
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [
  {
    path: '/user',
    component: Layout,
    redirect: '/user/index',
    meta: { title: '用户管理', icon: 'example', roles: ['admin'] },
    children: [
      {
        path: 'index',
        name: 'UserManager',
        component: () => import('@/views/user/index'),
        meta: { title: '用户管理', icon: 'form' }
      }
    ]
  },
  {
    path: '/salesroom',
    component: Layout,
    name: 'Salesroom',
    redirect: '/salesroom/index',
    meta: { title: '门店', icon: 'example', roles: ['admin', 'dealer'] },
    children: [
      {
        path: 'index',
        name: 'SaleRoomManager',
        component: () => import('@/views/salesroom/index'),
        meta: { title: '门店', icon: 'form' }
      },
      {
        path: 'detail',
        name: 'SaleRoomDetail',
        component: () => import('@/views/salesroom/detail'),
        meta: { title: '门店详情', icon: 'form' },
        hidden: true
      }
    ]
  },
  {
    path: '/area',
    component: Layout,
    name: 'Area',
    redirect: '/area/index',
    meta: { title: '区域', icon: 'example' },
    children: [
      {
        path: 'index',
        name: 'AreaQuery',
        component: () => import('@/views/area/index'),
        meta: { title: '区域查询', icon: 'form' }
      }
    ]
  },
  {
    path: '/chain',
    component: Layout,
    name: 'Chain',
    redirect: 'noRedirect',
    meta: { title: '系统', icon: 'example'},
    children: [
      {
        path: 'index',
        name: 'ChainManager',
        component: () => import('@/views/chain/index'),
        meta: { title: '系统审批', icon: 'form' ,roles: ['admin']}
      },
      {
        path: 'apply',
        name: 'Apply',
        component: () => import('@/views/chain/apply'),
        meta: { title: '系统管理', icon: 'form' ,roles: ['dealer']}
      }
    ]
  },
  {
    path: '/setting',
    component: Layout,
    name: 'Setting',
    redirect: 'noRedirect',
    meta: { title: '设置', icon: 'example' },
    children: [
      // {
      //   path: 'complaint',
      //   name: 'Complaint',
      //   component: () => import('@/views/setting/complaint'),
      //   meta: { title: '投诉建议', icon: 'form', roles: ['admin', 'dealer'] }
      // },
      {
        path: 'message',
        name: 'Message',
        component: () => import('@/views/setting/message'),
        meta: { title: '公告', icon: 'form', roles: ['admin'] }
      }
    ]
  },
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
