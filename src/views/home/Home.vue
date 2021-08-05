<template>
  <div class="home">
    <el-button @click="logout" type="info">退出</el-button>
  </div>
</template>

<script>
import { useRouter } from 'vue-router'
export default {
  name: 'Home',
  setup () {
    // 定义
    const router = useRouter() // 路由器用于跳转
    // 方法 事件
    const logout = () => { // 退出事件
      // 清空 token
      window.sessionStorage.clear();
      // 并且重新定向到登录页面
      router.push({ path: '/login' })

    }
    return {
      logout
    }
  }
}
</script>

<style lang="scss" scoped>
</style>