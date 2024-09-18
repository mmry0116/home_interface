
import vue from '@vitejs/plugin-vue'
import path from "path"
import { defineConfig } from "vite"
// import VueSetupExtend from 'vite-plugin-vue-setup-extend'


export default defineConfig({
  server: {
    // port: 8220
    // proxy: {
    //   '/aa': { // 匹配请求路径，localhost:3000/snow
    //     target: 'https://localhost:8220/home', // 代理的目标地址
    //     changeOrigin: true, // 开发模式，默认的origin是真实的 origin:localhost:3000 代理服务会把origin修改为目标地址
    //     // secure: true, // 是否https接口
    //     // ws: true, // 是否代理websockets
    //     // rewrite target目标地址 + '/abc'，如果接口是这样的，那么不用重写
    //     // rewrite: (path) => path.replace(/^\/snow/, '') // 路径重写，本项目不需要重写
    //   }
    // }
  },
  plugins: [
    vue(),
    // VueSetupExtend(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },

})
