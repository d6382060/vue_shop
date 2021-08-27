import { createRouter, createWebHashHistory } from 'vue-router'
const Login = () => import('../components/Login')
const Home = () => import('../views/home/Home')
const Welcome = () => import('../views/home/ChildComps/Welcome')
const Users = () => import('../views/user/Users')
const Rights = () => import('../views/power/Rights')
const Roles = () => import('../views/power/Roles')
const Cate = () => import('../views/goods/Cate')
const Params = () => import('../views/goods/Params')
const GoodsList = () => import('../views/goods/GoodsList')
const Add = () => import('../views/goods/Add')
const Order = () => import('../views/order/Order')
const routes = [
  { path: '/', redirect: '/login' }, // 重定向
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: {
      title: '首页-登录'
    }
  },

  {
    path: '/home',
    name: 'home',
    component: Home,
    redirect: '/welcome',  // 在访问主路由的时候重定向到子路由
    children: [ // 子路由
      {
        path: '/welcome',
        name: 'Welcome',
        component: Welcome,
        meta: {
          title: '欢迎使用'
        }
      },
      {
        path: '/users',
        name: 'Users',
        component: Users,
        meta: {
          title: '用户列表'
        }
      },
      {
        path: '/rights',
        name: 'Rights',
        component: Rights,
        meta: {
          title: '权限管理-权限列表'
        }
      },
      {
        path: '/roles',
        name: 'Roles',
        component: Roles,
        meta: {
          title: '权限管理-角色列表'
        }
      },
      {
        path: '/categories',
        name: 'Cate',
        component: Cate,
        meta: {
          title: '商品管理-商品分类'
        }
      },
      {
        path: '/goods',
        name: 'GoodsList',
        component: GoodsList,
        meta: {
          title: '商品管理-商品列表'
        }
      },
      {
        path: '/params',
        name: 'Params',
        component: Params,
        meta: {
          title: '商品管理-参数列表'
        }
      },
      {
        path: '/welcome',
        name: 'Welcome',
        component: Welcome,
        meta: {
          title: '欢迎使用'
        }
      },
      {
        path: '/orders',
        name: 'Order',
        component: Order,
        meta: {
          title: '订单管理'
        }
      },
      {
        path: '/users',
        name: 'Users',
        component: Users,
        meta: {
          title: '用户列表'
        }
      },
    ],
    meta: {
      title: '首页'
    },


  }


]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

// 导航守卫
router.beforeEach((to, from, next) => {
  if (to.path === '/login') return next();
  // 获取token
  const token = window.sessionStorage.getItem('token')
  if (!token) return next('/login')
  next()
  // 获取标题并且赋值 meta 里面的 title
  document.title = to.meta.title
})

export default router
