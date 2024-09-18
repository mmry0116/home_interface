<template>
  <MingyHeader/>

  <RouterLink v-show="false" to="/index"></RouterLink>
  <RouterLink v-show="false" to="/workspace"></RouterLink>

  <RouterView></RouterView>
  <Toaster />

</template>

<script setup lang="ts">
import MingyHeader from '@/components/MingyHeader.vue';
import Toaster from '@/components/ui/toast/Toaster.vue'

</script>

<style scoped>
 .outdiv{
  border: 2px solid red; 
  position: relative;
 }
 .inout{
  position: relative;
  float: right;
 }
 #warning{
  height: 100px;
  width:700px;
  margin: 0 auto;
 }
 
</style>