import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { ElButton, ElForm, ElFormItem, ElInput, ElMessage } from 'element-plus';
import 'element-plus/lib/theme-chalk/index.css';
import './assets/fonts/iconfont.css'
// 导入全局样式表
import './assets/css/global.css'

createApp(App).use(router).use(ElButton).use(ElForm).use(ElFormItem)
  .use(ElInput).use(ElMessage)
  .mount('#app')
