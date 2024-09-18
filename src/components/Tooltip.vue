<template>
  <AlertDialog ref="dialog">
    <AlertDialogTrigger as-child>
      <Button variant="link" class="p-0">
        {{dialog || 'AlertDialog1'}}
      </Button>
    </AlertDialogTrigger>
    <!-- 这个v-if 是给播放视频视频用的 需要w-[880px] h-[800px]  -->
    <AlertDialogContent v-if="contentSize == 1 " class="sm:max-w-[880px] h-[800px]  ">
      <AlertDialogHeader>
        <AlertDialogTitle>{{titleProp||'提示'}}</AlertDialogTitle>
        <Separator class="mt-2"/>
        <AlertDialogDescription>
        </AlertDialogDescription>
      </AlertDialogHeader>
      <!-- <div class="grid gap-7 py-1"> -->
        <slot/>
      <!-- </div> -->
      <AlertDialogFooter>
        <!-- <AlertDialogCancel>Cancel</AlertDialogCancel> -->
        <AlertDialogAction   @click="comfirmBack">{{footerProp||'继续'}}</AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>

    <!-- 给音乐播放器 -->
    <AlertDialogContent v-else-if="contentSize == 2" class="sm:max-w-[880px] h-[300px]  ">
      <AlertDialogHeader>
        <AlertDialogTitle>{{titleProp||'提示'}}</AlertDialogTitle>
        <Separator class="mt-2"/>
        <AlertDialogDescription>
        </AlertDialogDescription>
      </AlertDialogHeader>
      <div class="grid gap-7 py-1">
        <slot/>
      </div>
      <AlertDialogFooter>
        <!-- <AlertDialogCancel>Cancel</AlertDialogCancel> -->
        <AlertDialogAction   @click="comfirmBack">{{footerProp||'继续'}}</AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>

        <!-- 这个v-if 是图片浏览  -->
    <AlertDialogContent v-else-if="contentSize == 3 " class="sm:max-w-[880px] h-[900px] ">
      <AlertDialogHeader>
        <AlertDialogTitle>{{titleProp||'提示'}}</AlertDialogTitle>
        <Separator class="mt-2"/>
        <AlertDialogDescription>
        </AlertDialogDescription>
      </AlertDialogHeader>
      <!-- <div class="grid gap-7 py-1"> -->
        <slot/>
      <!-- </div> -->
      <!-- <AlertDialogFooter  id="AlertDialogFooterImage"  >
        <AlertDialogAction   @click="comfirmBack">{{footerProp||'继续'}}</AlertDialogAction>
      </AlertDialogFooter> -->
    </AlertDialogContent>

    <AlertDialogContent v-else class="sm:max-w-[460px]">
      <AlertDialogHeader>
        <AlertDialogTitle>{{titleProp||'提示'}}</AlertDialogTitle>
        <Separator class="mt-2"/>
        <AlertDialogDescription>
        </AlertDialogDescription>
      </AlertDialogHeader>
      <div class="grid gap-7 py-6">
        <slot/>
      </div>
      <AlertDialogFooter >
        <!-- <AlertDialogCancel>Cancel</AlertDialogCancel> -->
        <AlertDialogAction   @click="comfirmBack">{{footerProp||'继续'}}</AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>

  </AlertDialog>
</template>

<script setup lang="ts">
import {
AlertDialog,
AlertDialogAction,
AlertDialogContent,
AlertDialogDescription,
AlertDialogFooter,
AlertDialogHeader,
AlertDialogTitle,
AlertDialogTrigger
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ref } from 'vue';
const diaLogOutDiv = ref();
defineProps(['footerProp','titleProp','comfirmBack','dialog' ,'contentSize'])
defineExpose({diaLogOutDiv:diaLogOutDiv})

 
</script>

<style scoped>
  #container{
    height:200px;
  }
  .smContent{
    width: 460px;
  }
  #AlertDialogFooterImage{
    /* border: 2px solid red; */
    margin-top: 620px;
  }
</style>