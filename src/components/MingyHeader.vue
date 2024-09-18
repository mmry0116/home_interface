<template>
  <div id="headerContainer">
    <div id="leftButtonsDiv">
      <Button @click="routeHome"  variant="ghost" size="icon" id="homeButton" >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" 
            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-home">
            <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
            <polyline points="9 22 9 12 15 12 15 22"/>
          </svg>
      </Button>
      <Button @click="routeWorkspace"   variant="ghost" size="icon" id="homeButton" >
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" 
          stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" 
          class="lucide lucide-layers">
          <path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z"/>
          <path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65"/>
          <path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65"/>
        </svg>
      </Button>
      <Button @click="router.push('/test')" variant="ghost" size="icon" id="homeButton" class="p-0">
        <FlaskConical :size="20"/>
      </Button>
    </div>
    
    <div id="rightButtonsDiv">
      <Button @click="isLight = !isLight" variant="ghost" size="icon" class="p-0" >
        <Icon icon="radix-icons:moon" color="#5753C6" v-if="isLight" class="h-[1.0rem] w-[1.0rem] "/>  
        <Icon icon="radix-icons:sun" color="#FFDC00" v-if="!isLight" class=" h-[1.0rem] w-[1.0rem] "/>
      </Button>
      <DownloadView/>  
    </div>
  </div>
  <Separator class="mt-0"/>
  <!-- <Separator class="mt-11"/> -->

</template>

<script setup lang="ts" name="MingyHeader">
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Icon } from '@iconify/vue';
import { FlaskConical } from 'lucide-vue-next';
import { useColorMode } from '@vueuse/core';
import { ref, watch ,onBeforeMount} from 'vue';
import { useRouter } from 'vue-router';
import DownloadView from './DownloadView.vue'

const thmemMode = useColorMode()
let isLight = ref(true)
watch(isLight,()=>{
  thmemMode.value = thmemMode.value =="dark"?"light":"dark"
}) 


const router = useRouter()
function routeHome(){
  router.push({
    // name: 'jia'
    path: '/'
  })
  
}
function routeWorkspace(){
  router.push({
    path: '/workspace'
  })
}

</script>

<style scoped>
#headerContainer{
  display: flex;
  /* 定义主轴反向 */
  flex-direction: row; 
  justify-content: space-between;
  align-items: center;
}
#rightButtonsDiv{
display: flex;
}

</style>