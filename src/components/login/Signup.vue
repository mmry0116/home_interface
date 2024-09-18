<template>
 <form @submit="onSubmit">
  <div id="container" >
    <CardHeader>
      <div id="cardTitleDiv">
        <span id="loginTitle">
          注册
        </span>
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
                <Input type="text" placeholder="shadcn" v-bind="componentField" />
              </FormControl>
              <FormDescription>
                用户的唯一性
              </FormDescription>
              <FormMessage />
            </FormItem>
          </FormField>
        </div>

        <div id="formField2">
          <FormField v-slot="{ componentField }" name="password">
            <FormItem>
              <FormLabel>密码</FormLabel>
              <FormControl>
                <Input type="text" placeholder="shadcn" v-bind="componentField" />
              </FormControl>
              <FormDescription>
                用于验证用户  
              </FormDescription>
              <FormMessage />
            </FormItem>
            </FormField>
        </div>

      </form>
      <Button  id="buttonSignUP" >
        <LogIn class="w-4 h-4 mr-2" />
        注册
      </Button>
    </div>
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
FormDescription,
FormField,
FormItem,
FormLabel,
FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { toTypedSchema } from '@vee-validate/zod'
import { LogIn } from 'lucide-vue-next'
import { useForm } from 'vee-validate'
import * as z from 'zod'

const formSchema = toTypedSchema(z.object({
  username: z.string({required_error:"不能为空",description:"sssss"}).min(6,"字符需要大于6").max(24,"字符不能大于20"),
  password: z.string({required_error:"不能为空",description:"sssss"}).min(8,"字符需要大于8").max(24,"字符不能大于24"),
  // password: z.string({required_error:"不能为空"}).regex(new RegExp(/^\.\d+$/),"ssss"),
  
}))
const form = useForm({
  validationSchema: formSchema,
   
})

const onSubmit = form.handleSubmit((values) => {
  console.log('Form submitted!', values)
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
  #buttonSignUP{
    margin: 30px 0px;
    /* background-color: rgb(138, 138, 138); */
  }
  #container{
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
</style>