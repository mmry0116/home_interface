<template>
  <DropdownMenu  >
    <DropdownMenuTrigger>
      <Database class="w-6 h-6 mr-4"/>
    </DropdownMenuTrigger>
    <DropdownMenuContent class="ml-7"> 
      <!-- <DropdownMenuLabel>批量操作</DropdownMenuLabel> -->
      <DropdownMenuSeparator />
      <DropdownMenuItem v-for=" (driver) in drivers" :key="driver" :name="driver" @click="magicOper($event)"> 
        <Cylinder  color="green" class="h-5 w-5 ml-0 "/> 
        &nbsp;{{driver}}盘
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>

<script setup lang="ts">
import {
DropdownMenu,
DropdownMenuContent,
DropdownMenuItem,
DropdownMenuSeparator,
DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Cylinder, Database } from 'lucide-vue-next'

defineProps(['magicOper' ,'drivers'])

</script>

<style scoped>

</style>