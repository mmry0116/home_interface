<template>
<Dialog ref="dialog" >
  <DialogTrigger as-child>
    <Button variant="outline">
      dialog
    </Button>
  </DialogTrigger>
  <DialogContent class="sm:max-w-[425px]" >
    <DialogHeader>
      <DialogTitle>{{titleProp||'提示'}}</DialogTitle>
      <Separator class="mt-2"/>
      <DialogDescription>
        <!-- Make changes to your profile here. Click save when you're done. -->
      </DialogDescription>
    </DialogHeader>
    <div class="grid gap-7 py-2">
      <div class="grid gap-4 py-4">
        <div id="verityDiv"  >
         <img :src='kaptcha' alt="picture" id="verifyImg">
        </div>
        <div class="grid grid-cols-5 items-center gap-4 mb-5">
          <Label for="username" class="text-left">
            验证码：
          </Label>
          <Input  v-model="kaptchaInput" @keyup.enter="continueButton" class="col-span-4 ml-0 " />
        </div>
      </div>
    </div>
    <!-- <Separator class="mb-0"/> -->
    <DialogFooter>
      <div ref="dialogCloseDiv">
        <DialogClose >
          <Button type="button"  @click.stop="continueButton()">
              {{footerProp||'继续'}}
          </Button>
        </DialogClose>
      </div>
    </DialogFooter>
  </DialogContent>
</Dialog>

</template>

<script setup lang="ts">
import { Button } from '@/components/ui/button';
import {
Dialog,
DialogClose,
DialogContent,
DialogDescription,
DialogFooter,
DialogHeader,
DialogTitle,
DialogTrigger
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ref } from 'vue';
import { onMounted } from 'vue';
import { baseURL } from '@/tool/configAxios'
import { Separator } from '@/components/ui/separator'
const kaptcha = ref(baseURL+'/kaptcha.do')
const dialogCloseDiv = ref()
const kaptchaInput = ref()

function continueButton(){
  if(kaptchaInput.value){
    dialogCloseDiv.value.children[0].click()
    machineCheck(kaptchaInput.value)
  }
}

onMounted(()=>{
  // console.log("onMounted",footerProp,titleProp)
})
const {footerProp,titleProp,machineCheck} = defineProps(['footerProp','titleProp','machineCheck'])
interface kaptchaProps{
  machineCheck:any,
}
 
</script>

<style scoped>
  #container{
    height:200px;
  }
  #dialogCloseDiv{
    /* border: 2px solid red; */
    margin: 0px auto;
    margin-top: 20px;
  }
  #verityDiv{
    /* border: 2px solid red; */
    margin-left: 78px;
    margin-bottom: 8px;
    /* width: 200px;
    height: 200px; */
  }
</style>