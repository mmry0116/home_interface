<template>
  <Card id="containerCard">
    <div class="hidden h-full flex- flex-col space-y-8 p-6 md:flex">
      <div class="flex items-center justify-between space-y-2">
        <div>
          <h2 class="text-2xl font-bold tracking-tight">
            Welcome back!
          </h2>
          <p class="text-muted-foreground">
            欢迎回来！
          </p>
        </div>
        <div class="flex items-center space-x-2">
          <!-- <UserNav />
          UserNav -->
        </div>
      </div>
      <!-- <DataTable :data="tasks" :columns="columns" /> -->
      <DataTable v-if="files" :data="files" :columns="columns"/>
    </div>
</Card>
</template>

<script setup lang="ts">
import Card from '../ui/card/Card.vue';
import DataTable from './DataTable.vue';
import { columns } from './conlumns';
import {useDataStore} from '@/store/data'
import { onMounted ,ref} from 'vue';
import { storeToRefs } from "pinia";

const dataStore = useDataStore()
const {initData} = useDataStore()
initData()
const {fileData:files ,drivers} = storeToRefs(dataStore)

onMounted(()=>{
  console.log("ssssss")
})


</script>

<style scoped>
#containerCard{
  width: 1250px;
  margin: 50px auto;
}
</style>