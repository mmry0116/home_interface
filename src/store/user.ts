import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore('userStore', () => {

  const isLogin = ref<boolean>(false)

  return { isLogin }
})