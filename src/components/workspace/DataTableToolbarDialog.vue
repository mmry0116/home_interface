<template>
  <Dialog ref="dialog" >
    <DialogTrigger as-child @click="showDialog">
      <Button variant="outline">
        dialog
      </Button>
    </DialogTrigger>
    <DialogContent class="sm:max-w-[520px] max-h-[725px]"  >
      <DialogHeader class="p-0 flex ">
        <div class="flex flex-row items-center">
          <DialogTitle>{{titleProp||'提示'}}</DialogTitle>
          <Button class="ml-6 p-0" variant="ghost">
            <DataTableDriverDropdown :magicOper="magicOper" :drivers="drivers"/>
          </Button>
        </div>
        <div class="mt-0 mb-0 ml-1" >
          <Button  v-for="(pathName) in pathArr" :key="pathName" :name="pathName" variant="link" class=" pl-0 pr-0 ml-0 " 
            @click="updateData($event,1)">
            {{pathName}}>
          </Button>
        </div>
        <Separator class="mt-1 p-0 "/>
      </DialogHeader  >
      <DialogDescription v-show="false" >
        Make changes to your profile here. Click save when you're done.
      </DialogDescription>

      <div class="grid gap-0 py-0 max-h-[500px] min-h-[380px] "  ref="tableContainerRef" id="tableContainer">
        <ScrollArea>
          <div  >
          <Table class="w-[425px] ">
            <TableBody>

              <TableRowNoSeparator v-if="forkRowFlag" class=" translate-x-0"  >
                <div class="relative w-full max-w-sm items-center">
                  <TableCell class="font-medium p-0  ">
                      <Folder/>
                  </TableCell>
                  <TableCell  class="font-medium  w-90 ">
                    <div ref="inputDiv"> 
                    <Input class="ml-0 p-0 h-6 " v-model="newFolderName"/>
                    </div>
                  </TableCell>
                  <TableCell class="font-medium p-0  ">
                    <Badge  @click="saveForkRow" variant="green"  class="p-0 mr-2">
                      <svg width="20" height="20" viewBox="0 0 15 15" color="green" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M11.4669 3.72684C11.7558 3.91574 11.8369 4.30308 11.648 4.59198L7.39799 11.092C7.29783 11.2452 7.13556 11.3467 6.95402 11.3699C6.77247 11.3931 6.58989 11.3355 6.45446 11.2124L3.70446 8.71241C3.44905 8.48022 3.43023 8.08494 3.66242 7.82953C3.89461 7.57412 4.28989 7.55529 4.5453 7.78749L6.75292 9.79441L10.6018 3.90792C10.7907 3.61902 11.178 3.53795 11.4669 3.72684Z" fill="currentColor" fill-rule="evenodd" clip-rule="evenodd">
                        </path>
                      </svg>
                    </Badge>
                  </TableCell>
                  <TableCell class="font-medium p-0  ">
                    <Badge @click="closeForkRow" variant="outline"class="p-0">
                      <svg width="20" height="20" viewBox="0 0 15 15" color="" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M11.7816 4.03157C12.0062 3.80702 12.0062 3.44295 11.7816 3.2184C11.5571 2.99385 11.193 2.99385 10.9685 3.2184L7.50005 6.68682L4.03164 3.2184C3.80708 2.99385 3.44301 2.99385 3.21846 3.2184C2.99391 3.44295 2.99391 3.80702 3.21846 4.03157L6.68688 7.49999L3.21846 10.9684C2.99391 11.193 2.99391 11.557 3.21846 11.7816C3.44301 12.0061 3.80708 12.0061 4.03164 11.7816L7.50005 8.31316L10.9685 11.7816C11.193 12.0061 11.5571 12.0061 11.7816 11.7816C12.0062 11.557 12.0062 11.193 11.7816 10.9684L8.31322 7.49999L11.7816 4.03157Z" fill="currentColor" fill-rule="evenodd" clip-rule="evenodd">
                        </path>
                      </svg>
                    </Badge>
                  </TableCell>
                </div>
              </TableRowNoSeparator>
              <TableRowNoSeparator v-for="folderName in folderNameData" :key="folderName">
                <TableRow class=" translate-x-0" @click="updateData($event,2)" :name="folderName"  >
                  <TableCell class="font-medium p-0  ">
                      <Folder/>
                  </TableCell>
                  <TableCell class="font-medium  ">
                      <Button variant="link" size="ssm" class="p-0 m-0">
                        {{ folderName }} 
                    </Button>
                  </TableCell>
                </TableRow>
              </TableRowNoSeparator>
            </TableBody>
          </Table>
          </div>
        </ScrollArea>
      </div>
      <Separator class="mt-0 mb-0"/>
      <div id="footerContainer">
        <div id="createFloder">
          <Button variant="link" @click="newFolder" class="p-0" >创建新文件夹</Button>
        </div>
        <DialogFooter>
          <div class="flex flex-row">
            <Button variant="ghost" class="mr-2 w-24" @click="exitDialog">
              返回
            </Button>
            <div ref="dialogCloseDiv">
            <DialogClose >
              <Button type="button" @click="DialogCloseEvent" >
                {{footerProp||'继续'}}
              </Button>
            </DialogClose>
            </div>
          </div>
        </DialogFooter>
      </div>

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
import {
  Table,
  TableBody,
  TableRow,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRowNoSeparator,
} from '@/components/ui/table'
import { ref ,onBeforeMount ,nextTick} from 'vue';
import { Separator } from '@/components/ui/separator'
// import { pastPath } from '@/tool/mmryUtil';
import {   Folder  } from 'lucide-vue-next';
import { useDialogDataStore } from '@/store/dialogData.ts'
import { ScrollArea } from '@/components/ui/scroll-area'
import DataTableDriverDropdown from './DataTableDriverDropdown.vue';
import { storeToRefs } from 'pinia';
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {createFolder} from '@/tool/useAxios'
import {pastPathArr} from '@/tool/mmryUtil'
import { useDataStore } from '@/store/data';

const dataStore = useDataStore();
const dialogDataStore = useDialogDataStore()
let {folderNameData , pathArr , drivers } = storeToRefs( dialogDataStore)
const dialogCloseDiv = ref();
const inputDiv = ref()
let newFolderName = ref('新建文件夹')
const forkRowFlag = ref(false)
const tableContainerRef = ref()

// const paths = ref(['2021-07-16 19:09:41','2024-04-09 18:27:30','2023-04-19 10:35:59','aaaaavvvv'])
// const pathArr = ref(pastPath('G:/TIM/All Users/QQ/Misc/com.tencent.audiovideo'))

function updateData(event:Event,flag:number){
  const elem = event.currentTarget as HTMLElement
  dialogDataStore.updateDialogData(elem.getAttribute('name')!,flag)
}


function newFolder(){
  forkRowFlag.value = true
  nextTick(()=>{
    tableContainerRef.value.children[0].children[0].scrollTo({top: 0,behavior: 'smooth'})
    window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth' // 滚动行为：smooth平滑滚动，instant瞬间滚动，默认值auto，等同于instant
    })
    const elem = inputDiv.value.children[0]
    elem.select()
  })
  // elem.setAttribute('value','新建文件夹')
  // elem.ariaSelected
}

function magicOper(event:Event){
  const elem = event.currentTarget as HTMLElement
  console.log(elem.getAttribute('name')+'/')
  dialogDataStore.updateDialogData(elem.getAttribute('name')!+'/')
}

function closeForkRow (){
  forkRowFlag.value =false
}
function saveForkRow(){
  let fullFolderName = '';
  let path = ''
  dialogDataStore.pathArr?.forEach(p=>{
    path = path + p + '/'
  })
  fullFolderName = path + newFolderName.value
  console.log(fullFolderName) 
  createFolder(fullFolderName).then((res)=>{
    console.log(res)
    dialogDataStore.updateDialogData(path,3)
  }).finally(()=>{
    forkRowFlag.value =false
    newFolderName.value = '新建文件夹'
  })
}

//显示dialog时候需要将TableData 中路径用到这里
function showDialog (){
  let s = pastPathArr(dataStore.path!);
  console.log(s,dataStore.path)
  dialogDataStore.pathArr = dataStore.path
  dialogDataStore.updateDialogData(pastPathArr(dataStore.path!),3)
}
//退出diglog
function exitDialog(){
  dialogCloseDiv.value.children[0].click()
}
//dialog框确认
function DialogCloseEvent (){
  conmfirmBack(pastPathArr(dialogDataStore.pathArr!))
}

const {conmfirmBack} = defineProps(['footerProp','titleProp','conmfirmBack'])
// defineExpose({diaLogOutDiv:diaLogOutDiv})
onBeforeMount(()=>{
})
dialogDataStore.$subscribe((a,data)=>{
})
</script>


<style scoped>
#createFloder{
  position: relative;
  float: left;
}
#dialogTitleDiv{
  position: relative;
  float: left;
}
#tableContainer{
  border: 0px solid red;
  /* color: rgb(153, 62, 51); */
}
</style>