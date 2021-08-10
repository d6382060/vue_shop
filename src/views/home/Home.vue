<template>
  <el-container class="home-container">
    <!-- 头部区域 -->
    <el-header>
      <div>
        <img src="../../assets/img/heima.png" alt="" />
        <span>电商后台管理系统</span>
      </div>
      <el-button @click="logout" type="info"> 退出 </el-button>
    </el-header>
    <!-- 页面主体区 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <!-- 侧边栏菜单区 -->
        <!-- :default-active="route.path" 表示 点击拿个哪个高亮 -->
        <el-menu
          :default-active="route.path"
          router
          :collapse-transition="false"
          :collapse="isCollapse"
          unique-opened
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409EFF"
        >
          <!-- 一级菜单 -->
          <el-submenu
            :key="item.id"
            :index="index + ''"
            v-for="(item, index) in menulist"
          >
            <!-- 一级菜单的模板区域 -->

            <template #title>
              <!-- 图标 -->
              <i :class="iconsObj[item.id]"></i>
              <!-- 文本 -->
              <span>{{ item.authName }}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item
              v-for="subItem in item.children"
              :key="subItem.id"
              :index="'/' + subItem.path"
            >
              <template #title>
                <!-- 图标 -->
                <i class="el-icon-menu"></i>
                <!-- 文本 -->
                <span> {{ subItem.authName }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 右侧内容 -->
      <el-main>
        <!-- 路由占位符 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import { useRouter, useRoute } from 'vue-router'
import { getMneus } from '../../network/Authority'
import { onMounted, reactive, toRefs, ref } from 'vue'
export default {
  name: 'Home',
  setup () {
    // 定义
    const route = useRoute()
    const router = useRouter() // 路由器用于跳转
    const menulist = ref([]) //左侧菜单数据
    const iconsObj = reactive({
      '125': 'iconfont icon-user',
      '103': 'iconfont icon-tijikongjian',
      '101': 'iconfont icon-shangpin',
      '102': 'iconfont icon-danju',
      '145': 'iconfont icon-baobiao'
    })
    let isCollapse = ref(false) // 是否折叠
    // 方法 事件
    const logout = () => { // 退出事件
      // 清空 token
      window.sessionStorage.clear();
      // 并且重新定向到登录页面
      router.push({ path: '/login' })

    }
    const toggleCollapse = () => { // 点击，切换菜单的折叠和展开
      isCollapse.value = !isCollapse.value
    }

    onMounted(() => {
      getMneus().then(res => {
        if (res.status !== 200) return ElMessage.error(res.meta.msg)
        menulist.value = res.data.data
        // console.log(menulist.value);
      })

    })

    return {
      logout,
      menulist,
      iconsObj,
      toggleCollapse,
      isCollapse,
      route

    }
  }
}
</script>

<style lang="scss" scoped>
.home-container {
  height: 100%;
}
.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #fff;
  font-size: 20px;
  div {
    display: flex;
    align-items: center;
    span {
      margin-left: 15px;
    }
  }
}
.el-aside {
  background-color: #333744;
  transition: width 1s;
}
.el-main {
  background-color: #eaedf1;
}
.el-menu {
  border-right: solid 0px #e6e6e6;
}
.iconfont {
  margin-right: 10px;
}
.toggle-button {
  background-color: #4a5064;
  font-size: 10px;
  line-height: 24px;
  color: #fff;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
}
</style>