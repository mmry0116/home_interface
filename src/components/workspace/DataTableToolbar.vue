<script setup lang="ts">
import {
DropdownMenu,
DropdownMenuContent,
DropdownMenuItem,
DropdownMenuSeparator,
DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import type { Table } from '@tanstack/vue-table'
import type { dFile, File } from './index'
// import {ref,watch} from 'vue'
import { types } from './data'
import DataTableFacetedFilter from './DataTableFacetedFilter.vue'
// import DataTableViewOptions from './DataTableViewOptions.vue'
import { Button } from '@/components/ui/button'
// import { Separator } from '@/components/ui/separator'
import { Input } from '@/components/ui/input'
import { useDataStore } from '@/store/data'
// import pastPath from '@/tool/mmryUtil.ts'
import { Crop, Cylinder, Database, Star, Trash, WandSparkles,Download ,Copy } from 'lucide-vue-next'
import { ref ,nextTick } from 'vue'
// import { storeToRefs } from "pinia";
import { singleFileDownload } from '@/tool/download.ts'
import Tooltip from '../Tooltip.vue'
import DataTableViewOptions from './DataTableViewOptions.vue'
import { baseURL } from "@/tool/configAxios";
import {deleteFile ,shearFile} from '@/tool/useAxios'
import DataTableToolbarDialog from './DataTableToolbarDialog.vue'
import DataTableDriverDropdown from './DataTableDriverDropdown.vue'
import { useToast } from '@/components/ui/toast/use-toast'

const {toast} = useToast()
interface DataTableToolbarProps {
  table: Table<File>,
  filterr: Function,
}

const props = defineProps<DataTableToolbarProps>()
const dataStore = useDataStore()
const {updateData} = dataStore
const drivers = ref(dataStore.drivers)
const table =  props.table
const hitMsgArr = ref<string[]>()
const hitMsgContent =ref()
const titleProp =ref()
const dialogProps = ref<{footerProp:string,titleProp:string}>({titleProp:'',footerProp:''})
// const isFiltered = computed(() => props.table.getState().columnFilters.length > 0)
// console.log(props.table.getColumn('type')?.getSize())
// let arrPath = ref(pastPath('G:/DOCUMENT/chrome skin/Dark Space/images/images/chrome skin/Dark Space/chrome skin/Dark Space/chrome skin/Dark Space'))
// let arrPath = ref(pastPath(table.getSortedRowModel().rows[0].original.path))
// console.log(dataStore.path)
// let arrPath = ref(pastPath(dataStore.path))
 

function upTableData(event:any){
  let name = event.currentTarget.innerText as string
  dataStore.updateData(name.substring(0,name.length-1),1)
}

function magicOper(event:Event){
  const elem = event.currentTarget as HTMLElement
  dataStore.updateData(elem.getAttribute('name')+'/',0)
}

//下载大文件建议单个下载
const arrFiles =  [
  {
    name: 'yellow.webp',
    // url: '/home/download2.do?filePath=G:\第七特区.txt'
    path: 'G:/ff/yellow.webp'
  },
  {
    name: 'orange.webp',
    // url: '/home/download2.do?filePath=G:\漂洋过海来看你.mp3'
    path: 'G:/ff/orange.webp'
  }
]

const hintMsgDiv = ref()
const dialogDiv = ref()



function fileDownload(){
  let fileArray: dFile [] = []
  let isLeagal = true //不能下载隐藏文件
  let toltalSize:number = 0 
  let singleBigestSize:number = 0
  let directoryCount = 0  
  let fileCount = 0  
  table.getSelectedRowModel().rows.forEach( row =>{
    const original = row.original
    fileArray.push(
      {name:original.name,path:original.path+original.name ,size:Number(original.size)}
    )
    //隐藏文件夹不能下载
    if(original.type=="hide_directory"){
      isLeagal = false;
    }else if(original.type=="directory"){
      directoryCount ++;
    }else{//到了这里则是隐藏文件或文件
      fileCount ++
      toltalSize += Number(original.size) //计算总下载大小
      let singleSize = Number(original.size)
      if(singleSize> singleBigestSize) singleBigestSize = singleSize
    }
  })
  console.log(toltalSize)

  if (!isLeagal){  
    hitMsgContent.value = '不能下载隐藏文件夹'
    hintMsgDiv.value.children[0].click()
    return
  } 
  if(!directoryCount && !fileCount) {
    hitMsgContent.value = '请选择文件夹或文件夹'
    hintMsgDiv.value.children[0].click()
    // alert("请选中文件 或文件夹进行下载操作");
     return
  }
  
    //如果下载 文件+文件夹 或者 文件夹 则服务器打包
    //如果服务器计算文件大小超过1g 则拒绝
    //提示 所有文件大小： 
    //     所有文件夹大小： 未知等待服务端回复，过大会被拒绝
    //     大文件建议单独下载
  if((fileCount && directoryCount) || directoryCount ){
    if(toltalSize > 1 * 1024 * 1024 * 1024){
      hitMsgContent.value=''
      hitMsgArr.value = ['文件类型总大小超过1GB, 拒绝下载','大文件建议单独下载']
      hintMsgDiv.value.children[0].click()
      return;
    }
    let size =  Math.ceil(toltalSize / 1024 / 1024 * 100) / 100 + 'MB'
    hitMsgArr.value = ['下载的文件类型总大小：' + size , '文件总大小如果超过1GB 服务器会拒绝','大文件建议单独下载' ]
    hitMsgContent.value=''
    hintMsgDiv.value.children[0].click()
    let paths:string ='' ;
    fileArray.forEach(f=>{
      paths = paths + 'filePath='+f.path +'&'
    })
    paths.substring(0,paths.length)
    downloadSingle(fileArray[0],paths)
    return
  }
    //如果只下载文件就本地下载打包
    //提示最大文件大小 总文件大小 是否继续下载
    //     大文件建议单独下载
  if(fileCount > 1 && !directoryCount){
    singleFileDownload(fileArray)
    return
  }

  //单个文件下载
  if(fileCount = 1) downloadSingle(fileArray[0])
}

function downloadSingle(file:dFile,paths?:string){

  console.log("d1.......")
  let a = document.createElement('a')
  a.style.display = 'none'
  if(paths){
    a.href = baseURL + '/download2.do?' + paths
    a.download = 'a'
  }else{
    a.href = baseURL + '/download.do?filePath=' + file.path
    a.download = file.name
  }
  document.body.appendChild(a)
  try {
    a.click()
  } catch (error) {
    console.log(error)
  }
  document.body.removeChild(a)// 将标签从dom移除
}

//剪切按键触发
function fileShear (){
  
  if(table.getSelectedRowModel().rows.length <= 0){
    hintMsgDiv.value.children[0].click()
    return
  }
  dialogProps.value.titleProp = '剪切到'
  dialogProps.value.footerProp = '剪切到这里'
  dialogDiv.value.children[0].click()
}

//剪切功能子组件回调的方法 用于发送请求
//filePath string[] targetPath string
function fileShearComfirm(targetPath:string){
  let params = ''
    table.getSelectedRowModel().rows.forEach( row =>{
    const original = row.original
    params = params +'filePath=' + original.path + original.name + '&'
  })
  params = params + 'targetPath=' + targetPath + '&'
  if(dialogProps.value.titleProp == '复制到'){
    params = params + 'oper=' + 'copy'
    toast({
    title: '提示：',
    description: '复制操作正在处理中...',  
  })
  }else{
    params = params + 'oper=' + 'shear'
    toast({
    title: '提示：',
    description: '剪切操作正在处理中...',  
  })}

  console.log(params)

  shearFile(params).then((res)=>{
    if(res.code=='200'){
      if(dialogProps.value.titleProp == '复制到'){
        toast({
        title: '提示：',
        description: '复制操作完成',  
      })
      }else{
        toast({
        title: '提示：',
        description: '剪切操作完成',  
      })}
    //更新tableData数据
    updateData(targetPath)
    }else if(res.code == '206'){

    }

  }).catch(()=>{
    if(dialogProps.value.titleProp == '复制到'){
        toast({
        title: '提示：',
        description: '复制操作失败',  
      })
      }else{
        toast({
        title: '提示：',
        description: '剪切操作失败',  
      })}
  })
}

function fileCopy(){
  if(table.getSelectedRowModel().rows.length <= 0){
    hintMsgDiv.value.children[0].click()
    return
  }
  dialogProps.value.titleProp = '复制到'
  dialogProps.value.footerProp = '复制到这里'
  dialogDiv.value.children[0].click()
}


// let failPaths = JSON.parse('[\"G:/xx/a\",\"G:/xx/aa\"]')
// console.log(failPaths)
function fileDelete(){

  let filePaths:string = ''
  let path = table.getSelectedRowModel().rows[0]?.original.path
  let isHideDiretory = false
  table.getSelectedRowModel().rows.forEach( row =>{
    const original = row.original
    if(original.type == 'hide_directory'){
      isHideDiretory = true
    }
    filePaths = filePaths + "filePath=" +  original.path+original.name +'&'
  })
  if(filePaths == '') {
    hitMsgContent.value = '请选择文件夹或文件夹'
    hintMsgDiv.value.children[0].click()
    // let content = ['2021-07-16 19:09:41','2021-07-16 19:09:41','2021-07-16 19:09:41']
    // hitMsgArr.value = content;
    // hintMsgDiv.value.children[0].click()
    return
  }else if(isHideDiretory){
    hitMsgContent.value = '不能删除隐藏文件夹'
    hintMsgDiv.value.children[0].click()//无效
    return
  }

  console.log(filePaths)

  deleteFile(filePaths).then(res=>{
    console.log(res)
    if(res.code == '200'){
      console.log("删除成功")
      //更新数据
      updateData(path,1)
    }else if(res.code == '206'){
      titleProp.value = '以下文件删除失败'
      hitMsgArr.value = res.content;
      hintMsgDiv.value.children[0].click()
      //更新数据
      // updateData(path,1)
    }else{
      hitMsgContent.value = '删除失败'
      hintMsgDiv.value.children[0].click()
    }
  }).catch(()=>{
    hitMsgContent.value = '删除失败'
    hintMsgDiv.value.children[0].click()
  })
}

function collection(){
  hitMsgContent.value = '未实现该功能'
  hintMsgDiv.value.children[0].click()
}

//Tooltip 组件的comfirm按钮退出的回调 来重置
function comfirmBack(){
  setTimeout(() => {
  titleProp.value = ''
  hitMsgContent.value = '请选择文件夹或文件夹'
  hitMsgArr.value = [];
  }, 500);

}

dataStore.$subscribe((dataStroe,states)=>{
  //数据更新了就重置复选框
  // console.log('数据更新了就重置复选框')
  if(states.isFlushCheckbox) table.toggleAllRowsSelected(false)
   table.getColumn('type')?.setFilterValue(['file','directory'])
})
</script>

<template>
  <div class="flex items-center justify-between">

    <div class="flex flex-1 items-center space-x-2" id="container">
      <div v-show="false" ref="hintMsgDiv">
        <Tooltip footerProp="" :titleProp="titleProp" :comfirmBack="comfirmBack"  >
          <p v-if="hitMsgContent || !hitMsgArr">{{  hitMsgContent || '请选择文件夹或文件夹'  }}</p>
          <p v-if="hitMsgArr" v-for=" hitMsg in hitMsgArr">{{  hitMsg }}</p>
        </Tooltip>  
      </div> 

      <div v-show="false" ref="dialogDiv">
        <DataTableToolbarDialog :titleProp="dialogProps.titleProp" :footerProp="dialogProps.footerProp" :conmfirmBack="fileShearComfirm"/>
      </div> 

      <div id="magicButton">
        <Button variant="ghost" class="h-8 w-5 ml-2 mr-2 ">
          <DropdownMenu  >
            <DropdownMenuTrigger>
              <WandSparkles color="#FF81D0"class="w-5 h-5"/>
            </DropdownMenuTrigger>
            <DropdownMenuContent class="ml-7"> 
              <!-- <DropdownMenuLabel>批量操作</DropdownMenuLabel> -->
              <DropdownMenuSeparator />
              <DropdownMenuItem  @click="fileDownload()">
                <Download color="#44803F" class="h-5 w-5 ml-5"/> 
                &nbsp;下载
              </DropdownMenuItem>
              <DropdownMenuItem @click="fileCopy()">
                <Copy color="#44803F" class="h-5 w-5 ml-5 "/> 
                &nbsp;复制
              </DropdownMenuItem>
              <DropdownMenuItem @click="fileShear()">
                <Crop color="#44803F" class="h-5 w-5 ml-5 "/> 
                &nbsp;剪切
              </DropdownMenuItem>
              <DropdownMenuItem @click="fileDelete()"> 
                <Trash color="rgb(238, 18, 18)" class="h-5 w-5 ml-5"/> 
                  &nbsp;删除
              </DropdownMenuItem>
              <DropdownMenuItem @click="collection()" >
                <Star fill='yellow' color='#FF5A33' class="h-5 w-5 ml-5"/> 
                &nbsp;收藏
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </Button>
      </div>

      <div class="driverDiv ">
        <Button variant="ghost" class="h-8 w-5 ml-2 ml-10 mr-9 ">
        <DataTableDriverDropdown :magicOper="magicOper" :drivers="drivers"/>
      </Button>
      </div>

      <!-- <Separator orientation="vertical" />  -->
      <div id="pathDiv" class="w-[600px]">
      <!-- <div id="pathDiv" class="w-[500px] lg:w-[680px]"> -->
        <!-- <Button variant="link" class="pl-0 pr-0 ml-0 mr-2">
          去上层
          </Button> -->
        <!-- <template v-for="(path) in dataStore.$state.path" :key="path" > -->
        <!-- <template v-for="(path) in arrPath" :key="path" > -->
          <Button  v-for="(path) in dataStore.$state.path" :key="path" variant="link" class=" pl-0 pr-0 ml-0 mr-1 " 
            @click="upTableData($event)">
          {{path}}>
          </Button>
        <!-- </template> -->
      </div>

      <Input
        placeholder="搜索"
        class="h-8 w-[130px] lg:w-[200px]"
        @keydown="props.filterr($event.target.value)"
      />
      
      <DataTableFacetedFilter
        v-if="table.getColumn('type')"
        :column="table.getColumn('type')"
        title="文件类型"
        :options="types"
      />
      <!-- <Button
        v-if="isFiltered"
        variant="ghost"
        class="h-8 px-2 lg:px-3"
        @click="props.table.resetColumnFilters()"
      >
        清空
        <Cross2Icon class="ml-2 h-4 w-4" />
      </Button> -->
    </div>
    <DataTableViewOptions :table="props.table" />
  </div>
</template>

<style scoped>

.driverDiv{
  /* border: 2px solid red; */
  position: relative;
  float: left;
}
#container{
  font-size: medium;
}

</style>
#pathDiv{
  /* border: 2px solid red; */
  /* width: 700px; */
  /* font-size: larger; */
}
#magicButton{
  /* border: 1px solid red; */
}