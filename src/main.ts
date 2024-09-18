import '@/assets/index.css'
import { createPinia } from 'pinia'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router/index'
// import VueDragResize from 'vue-drag-resize'

import VueViewer from 'v-viewer'
import 'viewerjs/dist/viewer.css'

const pinia = createPinia()

// 启动项目并暴露端口 npm run dev 
// 打包项目 npm run bulid

createApp(App)
  .use(router)
  .use(pinia)
  .use(VueViewer)
  // .component('vue-drag-resize', VueDragResize)
  .mount('#app')
