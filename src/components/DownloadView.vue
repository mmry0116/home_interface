<template>
   
  <div id="downloadContainer" >
    <Menubar class="border-0" >
      <MenubarMenu>
        <MenubarTrigger  class="p-2">
          <div ref="settingButton">
            <Settings @click="resetIsShow" class="w-4 h-4 p-0 mr-0"/>
          </div>

        </MenubarTrigger>
        <MenubarContent class="h-[400px] w-[540px]" v-if="isShow">
          <AlertDialog>
            <AlertDialogTrigger as-child>
                <Button variant="outline" size="default" class="ml-4 mt-4 mb-4" >
                  登出
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>退出登录?</AlertDialogTitle>
                <AlertDialogDescription class="mt-4">
                  你将要退出登录，是否确认？
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>取消</AlertDialogCancel>
                <AlertDialogAction @click="doLlogout" >确定</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <Separator/>

          <Card class="p-4 m-3 w-[530px]" v-show="dFiles?.length">
            <Table class="w-[490px]">
              <TableCaption v-if="dFiles">下载列表</TableCaption>
              <TableCaption v-else>下载列表为空</TableCaption>
              <MenubarSeparator />
              <TableHeader>
                <TableRow>
                  <TableHead class="w-[140px]">
                    文件名
                  </TableHead>
                  <TableHead v-show="false">路径</TableHead>
                  <TableHead class="w-[100px]">大小</TableHead>
                  <TableHead class=" w-[200px]">下载进度</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow v-for="file in dFiles" :key="file.name"  >
                  <!-- class="text-right" -->
                  <TableCell class="font-medium w-[140px]"  >
                    {{ file.name.length > 10 ?file.name.substring(0,10)+'...' : file.name }}
                  </TableCell>
                  <TableCell v-show="false">{{ file.path }}</TableCell>
                  <TableCell class="w-[100px]" >{{ formatFileSize(file.size)}}</TableCell>
                  <TableCell class=" w-[200px]">
                    <template v-if="!file.precent">未开始</template>
                    <template v-else-if=" !file.precent && (file.status == 'fail' || file.status == 'failfail') ">{{file.status}}</template>
                    <template v-else>
                      <Progress id="progress" v-model="file.precent " class=" w-4/5 bg-downloadingFile" />
                      <!-- <Progress v-if="file.precent = 100" v-model="file.precent " class=" w-4/5" /> -->
                      {{ file.precent }}%
                    </template>
                  </TableCell>
                  
                  <MenubarSeparator />
                </TableRow>
              </TableBody>
            </Table>
          </Card>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
 
  </div>
</template>

<script setup lang="ts">
  import {
Menubar,
MenubarContent,
MenubarMenu,
MenubarSeparator,
MenubarTrigger
} from '@/components/ui/menubar';
import { Progress } from '@/components/ui/progress';
import {
Table,
TableBody,
TableCaption,
TableCell,
TableHead,
TableHeader,
TableRow,
} from '@/components/ui/table';
import {
AlertDialog,
AlertDialogAction,
AlertDialogCancel,
AlertDialogContent,
AlertDialogDescription,
AlertDialogFooter,
AlertDialogHeader,
AlertDialogTitle,
AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button'
import { useDownloadStore } from '@/store/downloadStore';
import { formatFileSize } from '@/tool/mmryUtil';
import { Settings } from 'lucide-vue-next';
import { ref ,onBeforeMount} from 'vue';
import { Card } from './ui/card';
import {logout} from '@/tool/useAxios'
import { useRouter } from 'vue-router';
import { useToast } from '@/components/ui/toast/use-toast'
import { useUserStore } from '@/store/user';

const isShow = ref(true)
const { toast } = useToast()
const router = useRouter()
const downloadStore = useDownloadStore()
const userStore = useUserStore()
let dFiles = ref(downloadStore.dFiles)
const settingButton = ref();

function doLlogout(){
  console.log(userStore.isLogin)
  if(!userStore.isLogin ){
    toast({
      title: '未登录',
      description: '您还未登录，请登录再试',
      variant: 'default',
    });
    isShow.value = false
    return
  }
  logout({}).then(res=>{
    console.log(res)
    if(res.msg == '注销成功'){
      router.replace('/')
      userStore.isLogin = false
      isShow.value = false
    }else{
      failLogout()
    }
  }).catch(()=>{
    failLogout()
  })
}

function failLogout(){
  toast({
    title: '登出失败',
    description: '退出登录失败，请重试',
    variant: 'destructive',
  });
}
function  resetIsShow(){
  isShow.value = true;
}

downloadStore.$subscribe((a,status)=>{
  dFiles.value = status.dFiles;
})
</script>

<style scoped>
  #progress{
    background-color: #60a5fa;
  }
</style>