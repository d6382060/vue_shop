import { createRouter, createWebHashHistory } from 'vue-router'
const Login = () => import('../components/Login')
const Home = () => import('../views/home/Home')
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
    meta: {
      title: '主页'
    }
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
