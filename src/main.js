import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import {
  ElButton, ElForm, ElFormItem,
  ElInput, ElMessage, ElContainer,
  ElHeader, ElAside, ElMain, ElMenu, ElSubmenu,
  ElMenuItem, ElBreadcrumb, ElBreadcrumbItem, ElStep,
  ElCard, ElRow, ElCol, ElTable, ElTableColumn, ElCheckbox, ElCheckboxGroup,
  ElSwitch, ElTooltip, ElPagination, ElDialog, ElLoading,
  ElMessageBox, ElTag, ElTree, ElSelect, ElOption, ElSteps,
  ElResult, ElIcon, ElCascader, ElAlert, ElTabs, ElTabPane,
  ElUpload, ElTimeline, ElTimelineItem
} from 'element-plus';
import 'element-plus/lib/theme-chalk/index.css';
import './assets/fonts/iconfont.css'

import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css';

// 导入全局样式表
import './assets/css/global.css'

createApp(App).use(router).use(ElButton).use(ElForm).use(ElFormItem)
  .use(ElInput).use(ElMessage).use(ElContainer).use(ElCol).use(ElPagination)
  .use(ElTable).use(ElTableColumn).use(ElSwitch).use(ElTooltip).use(ElLoading)
  .use(ElHeader).use(ElAside).use(ElMain).use(ElBreadcrumb).use(ElBreadcrumbItem)
  .use(ElMenu).use(ElSubmenu).use(ElMenuItem).use(ElCard).use(ElRow).use(ElCheckbox).use(ElCheckboxGroup)
  .use(ElDialog).use(ElMessageBox).use(ElTag).use(ElTree).use(ElAlert)
  .use(ElSelect).use(ElOption).use(ElResult).use(ElIcon).use(ElCascader)
  .use(ElTabs).use(ElTabPane).use(ElSteps).use(ElStep).use(ElUpload)
  .use(ElTimeline).use(ElTimelineItem)
  .component('QuillEditor', QuillEditor)
  .mount('#app')