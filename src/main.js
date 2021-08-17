import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import {
  ElButton, ElForm, ElFormItem,
  ElInput, ElMessage, ElContainer,
  ElHeader, ElAside, ElMain, ElMenu, ElSubmenu,
  ElMenuItem, ElBreadcrumb, ElBreadcrumbItem,
  ElCard, ElRow, ElCol, ElTable, ElTableColumn,
  ElSwitch, ElTooltip, ElPagination, ElDialog,
  ElMessageBox, ElTag, ElTree, ElSelect, ElOption,
  ElResult, ElIcon, ElCascader
} from 'element-plus';
import 'element-plus/lib/theme-chalk/index.css';
import './assets/fonts/iconfont.css'

// 导入全局样式表
import './assets/css/global.css'

createApp(App).use(router).use(ElButton).use(ElForm).use(ElFormItem)
  .use(ElInput).use(ElMessage).use(ElContainer).use(ElCol).use(ElPagination)
  .use(ElTable).use(ElTableColumn).use(ElSwitch).use(ElTooltip)
  .use(ElHeader).use(ElAside).use(ElMain).use(ElBreadcrumb).use(ElBreadcrumbItem)
  .use(ElMenu).use(ElSubmenu).use(ElMenuItem).use(ElCard).use(ElRow)
  .use(ElDialog).use(ElMessageBox).use(ElTag).use(ElTree)
  .use(ElSelect).use(ElOption).use(ElResult).use(ElIcon).use(ElCascader)
  .mount('#app')