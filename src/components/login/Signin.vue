<template>
<form @submit="onSubmit" action="http://www.baidu.com">
  <div id="loginDiv" >
    <CardHeader>
      <div id="cardTitleDiv">
        <span id="loginTitle"> 登录 </span>
      </div>
    </CardHeader>
    <!-- :class="cn('grid gap-6' ) " 将按钮变成网格 填充整个网格 -->
    <div :class="cn('grid gap-6' ) " id="div2">
      <form @submit.pr="onSubmit"  >
        <div id="formField1">
          <FormField v-slot="{ componentField }" name="username" id="unameField">
            <FormItem>
              <FormLabel >用户名</FormLabel>
              <FormControl>
                <Input type="text" placeholder="username" v-bind="componentField" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
        </div>
        <div id="formField2">
          <FormField v-slot="{ componentField }" name="password"  >
            <FormItem>
              <FormLabel>密码</FormLabel>
              <FormControl>
                <Input type="password" placeholder="password" v-bind="componentField"  />
              </FormControl>
              <FormMessage />
            </FormItem>
            </FormField>
        </div>
        <div class="flex items-center space-x-2 mt-6">
          <Checkbox id="terms" v-model:checked="rememberMe" />
          <label
            for="terms"
            class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            记住我2个星期
          </label>
        </div>
      </form>
      <Button  id="buttonLogin" @click="clickLogin" >
        <LogIn class="w-4 h-4 mr-2" />
        登录
      </Button>
    </div>
  </div>
  
  <div ref="toolTip1" v-show="false">
    <Tooltip footerProp="" titleProp="" >
      <p>{{ toolTip.content ||'用户名或密码不能为空'}}</p>
    </Tooltip>
  </div>

  <div ref="TooltipCenterRef" v-show="false">
    <TooltipKaptcha footerProp="提交" titleProp="验证是否是机器人" 
      :machineCheck="machineCheck"
    />
  </div>
</form>
</template>

<script setup lang="ts">
import { Button } from '@/components/ui/button'
import {
CardHeader,
} from '@/components/ui/card'
import {
FormControl,
FormField,
FormItem,
FormLabel,
FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { login } from '@/tool/useAxios'
import { toTypedSchema } from '@vee-validate/zod'
import { LogIn } from 'lucide-vue-next'
import { useForm } from 'vee-validate'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import * as z from 'zod'
import Tooltip from '../Tooltip.vue'
import { Checkbox } from '../ui/checkbox'
import TooltipKaptcha from './TooltipKaptcha.vue'
import {useUserStore} from '@/store/user.ts'

const userStore = useUserStore()
const router = useRouter();
//验证码是否通过flag
let kaptchaFlag=ref(false)
let toolTip=ref({content:''})

//登录时候用户名 密码可以为空
const formSchema = toTypedSchema(z.object({
  username: z.string({required_error:""}),
  password: z.string({required_error:""}),
  // password: z.nullable(z.any())
  // password: z.string({required_error:"不能为空"}).regex(new RegExp(/^\.\d+$/),"ssss"),
  
}))
const form = useForm({validationSchema: formSchema,})
 
// 如果用户没有输入账号 密码 提示一下
const TooltipCenterRef =ref()
const toolTip1 =ref()
const rememberMe = ref(false)

const clickLogin = ()=>{
  const {username,password} = form.values
  if( !username || !password ){    
    toolTip1.value.children[0].click()
    return
  }
  // 验证 验证码
  TooltipCenterRef.value.children[0].click()
}

function machineCheck(kaptchaValue:string){
  const {username,password} = form.values
  login( {pwd : password , user : username , kaptcha:kaptchaValue, 'remember-me':rememberMe.value} )
    .then(res=>{
      console.log(res)
      if (res.msg !='登录成功') {
        console.log(res)
        toolTip.value.content = res.msg
        toolTip1.value.children[0].click()
        return
      }
      router.push("/workspace")
      userStore.isLogin = true;
    }).catch(()=>{
      toolTip.value.content = '服务器忙请稍后重试'
      toolTip1.value.children[0].click()
    })
}

const onSubmit = form.handleSubmit((values) => {
  console.log('Form submitted!', values)
  //判断账号密码是否为空

})

</script>

<style scoped>
  #div2{
    width: 400px;
    margin: 0px auto;
    /* border: 2px solid red; */
  }
  #formField1{
    margin-top: 10px;
  }
  #formField2{
    margin-top: 40px;
  }
  #buttonLogin{
    margin: 30px 0px;
    margin-top: 40px;
    /* background-color: rgb(138, 138, 138); */
  }
  #loginDiv{
    margin-top: 80px;
    /* border: 2px solid red; */
  }
  #cardTitleDiv{
    margin: 0px auto;
     
  }
  #loginTitle{
    font-size: 26px;
    font-weight: 600;
     
  }
  #size{
  
  }
  #verityDiv{
    border: 2px solid red;
    margin: 0px auto;
    /* width: 200px;
    height: 200px; */
  }
</style>