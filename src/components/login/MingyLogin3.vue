<template>
  <Card id="card1">
    <div id="inUpButton">
      <Button variant="ghost" @click="isLogin = !isLogin" >
        {{showLogin}} 
      </Button>
    </div>
    <Signup id="signupDive"  v-show="!isLogin"/>  
    <Signin id="loginDiv" v-show="isLogin"/>
  </Card>
</template>

<script setup lang="ts">
import Signin from '@/components/login/Signin.vue';
import { Button } from '@/components/ui/button';
import {
Card
} from '@/components/ui/card';
import { ref, watch } from 'vue';
import Signup from './Signup.vue';

const showLogin = ref('sing up 注册');
const isLogin = ref(true);
watch(isLogin,(value)=>{
  showLogin.value = value == true ? 'sing up 注册' : "sign in 登录"
})
</script>

<style scoped>
  form{
    width: 400px;
    margin: 0px auto;
    margin-top: 0px ;
  }
  #card1{
    width: 600px;
    height: 800px;
    margin: 10px auto;
    margin-top: 20px;
  }
  #inUpButton{
    margin-top: 20px;
    /* 给Signin 组件预留位置 */
    margin-bottom: 80px;
    margin-left: 77%;
  }
  font{
    font-family:  Courier, "Courier New", monospace 
  }

</style>


 