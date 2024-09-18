<template>
  <div class="cellWeidth" >
    <template v-if="row.getValue('type')==='directory'||row.getValue('type')==='hide_directory'">
      <!-- <a @onclick="UpdateData(row.getValue('path') as string + row.getValue('name') as string)">
          ssssss</a> -->
      <Button
        id="button"
        variant="link" 
        class="pl-0"
        @click="UpdateDataDo(row.getValue('path') as string + row.getValue('name') as string)"
        > 
        {{ row.getValue('name') }}
      </Button>
    </template>
    <template v-else-if="row.getValue('type') === 'video' ">
        <div ref="hintMsgDiv">
          <Tooltip  footerProp="关闭"  :titleProp="row.getValue('name')!.substring(0,row.getValue('name')!.lastIndexOf('.')) "  
            comfirmBack="" :dialog="row.getValue('name')"  :contentSize="1">
              <VideoPlayer :videoPath="row.getValue('path')as string + row.getValue('name')"/>
          </Tooltip>  
        </div> 
    </template>

    <template v-else-if=" row.getValue('type') === 'music' ">
        <div ref="hintMsgDiv">
          <Tooltip  footerProp="关闭"  :titleProp="row.getValue('name')!.substring(0,row.getValue('name')!.lastIndexOf('.')) "  
            comfirmBack="" :dialog="row.getValue('name')"  :contentSize="2">
              <MusicPlayer :musicPath="row.getValue('path')as string + row.getValue('name')"/>
          </Tooltip>  
        </div> 
    </template>

    <template v-else-if=" row.getValue('type') === 'image' ">
        <div ref="hintMsgDiv" @click="initImages"  >

          <Tooltip  footerProp="关闭"  :titleProp="row.getValue('name') "  
            comfirmBack="" :dialog="row.getValue('name')"  :contentSize="3" >
              <viewer :images="images"
                      @inited="inited"
                      rebuild
                      :options="options" 
                      class="viewer" ref="viewer"
                      
                      >
                <template #default="scope">
                  <figure class="images">
                    <div class="image-wrapper">
                      <img class="image" v-for="src in scope.images" :src="src" :key="src" >
                    </div>
                  </figure>
                </template>
              </viewer>
          </Tooltip>  
        </div> 
    </template>

    <template v-else>
        <div ref="hintMsgDiv">
          {{row.getValue("name")}}
        </div> 
    </template>
  </div>
</template>
  
<script setup lang="ts">
import { useDataStore } from '@/store/data';
import { Button } from '../ui/button';
import VideoPlayer from '../VideoPlayer.vue';
import MusicPlayer from '../MusicPlayer.vue';
import 'viewerjs/dist/viewer.css' 
import { component as Viewer } from "v-viewer"
import Tooltip from '../Tooltip.vue'// import  { fileSchema } from './index';
import { baseURL } from '@/tool/configAxios';
import {ref ,onMounted } from 'vue'
import type { Table ,Row} from '@tanstack/vue-table'
import { File } from '.';

interface DataUpdateProps{
  table: Table<File>,
  row:Row<File> 
}

const images = ref<string[]>([])
const rowCopy = ref()
const sourceImages = ref<string[]>([])
const dataStore= useDataStore()
const props= defineProps<DataUpdateProps>()
let $Viewer:Viewer ;
 
const options = ref({
  inline: true,
  button: true,
  navbar: true,
  title: true,
  toolbar: {
    reset: 'large',
    oneToOne: 'large',
    prev: {
      click: prevCallBack,
      show: true,
      size: 'large',
    },
    play: 'large',
    next: {
      click: nextCallBack,
      show: true,
      size: 'large',
    },
    rotateLeft: false,
    rotateRight: 'large',
    flipHorizontal: 'large',
    flipVertical: 'large',
    zoomIn: false,
    zoomOut: false,
  },
  tooltip: true,
  movable: true,
  zoomable: true,
  rotatable: true,
  scalable: true,
  transition: true,
  fullscreen: true,
  keyboard: true,
  // url: 'data-source',
})   

const imageIndex = ref(-1)
function initImages(){
  // console.log('initImages...' ,row.getValue('path'),row.getValue("name"))
  const rows =  props.table.getCoreRowModel().rows
  let imagePath:string = props.row.original.path + props.row.original.name 
  let url  ,r , tempPath
  for(let i = 0; i < rows.length ;i++){
    r = rows[i].original
    tempPath =r.path + r.name
    url = baseURL + '/transfer/displayImage.do?path=' + tempPath
    if(r.type == 'image') sourceImages.value.push(url)
    if(tempPath == imagePath) imageIndex.value = i 
  }
  console.log('imageName: ' ,props.row.original.name)

  sortFiveImage()

}

function sortFiveImage(){
  //大小
  if( props.row.getValue('大小')!.indexOf('KB') == -1){
    // images.value.splice( 0 , 5 ,  sourceImages.value[imageIndex.value])
    sortThreeImage()
    return
  }

  let tempArr:string[] ;
  if(imageIndex.value <= -1 && sourceImages.value.length > 1){
    tempArr = sourceImages.value.slice(0,5)
  }
  if(imageIndex.value >= 2 && imageIndex.value <= sourceImages.value.length - 1 -2){
    tempArr = sourceImages.value.slice(imageIndex.value-2,imageIndex.value + 3)
  }else if(imageIndex.value < 2){
    let tailCount = 5 - (imageIndex.value + 1 + 2 )
    // console.log(sourceImages.value.slice(- tailCount))
    // console.log( sourceImages.value.slice(imageIndex.value))
    tempArr = sourceImages.value.slice(- tailCount).concat( sourceImages.value.slice(0,imageIndex.value + 1 + 2 ))
  }else {
    let headCount = 5- ( sourceImages.value.length - 1 -  imageIndex.value  + 3) 
    tempArr = sourceImages.value.slice(imageIndex.value-2,sourceImages.value.length).concat( sourceImages.value.slice(0,headCount))
  }
  images.value.splice( 0 , 5 , ...tempArr)
  // console.log(images.value)
  // images.value.push(sourceImages.value[imageIndex.value + 1])
}

function sortThreeImage(){
  let width = 1;
  let three = 3;
  let tempArr:string[] ;
  if(imageIndex.value <= -1 && sourceImages.value.length > 1){
    tempArr = sourceImages.value.slice(0,three)
  }
  if(imageIndex.value >= width && imageIndex.value <= sourceImages.value.length - 1 -width){
    tempArr = sourceImages.value.slice(imageIndex.value-width,imageIndex.value + 1 +width)
  }else if(imageIndex.value < width){
    let tailCount = three - (imageIndex.value + 1 + width )
    tempArr = sourceImages.value.slice(- tailCount).concat( sourceImages.value.slice(0,imageIndex.value + 1 + width ))
  }else {
    let headCount = three- ( sourceImages.value.length - 1 -  imageIndex.value  + 1 +width) 
    tempArr = sourceImages.value.slice(imageIndex.value-width,sourceImages.value.length).concat( sourceImages.value.slice(0,headCount))
  }
  images.value.splice( 0 , 5 , ...tempArr)
}

function UpdateDataDo (path:string){
  dataStore.updateData(path,0)
}
let  a:string
function inited(viewer:any){
   $Viewer = viewer
  if( props.row.getValue('大小')!.indexOf('KB') == -1 ){
    $Viewer.next()
  }else{
    $Viewer.next()
    $Viewer.next()
  }

  //  console.log(viewer)
}

function nextCallBack( ){
  if(imageIndex.value + 1 <= sourceImages.value.length){ imageIndex.value ++ 
  }else{
    imageIndex.value = 0 
  }
  sortFiveImage()
  // $Viewer.next()
  console.log('nextCallBack...')
}

function prevCallBack( ){
  if(imageIndex.value - 1 >= 0){ imageIndex.value -- 
  }else{
    imageIndex.value = sourceImages.value.length - 1 
  }
  sortFiveImage()
  // $Viewer.prev()
  
  console.log('prevCallBack...')
}



</script>

<style scoped >

.cellWeidth{
  position: relative;
  float: left;
}

#button{
  max-width: 1200px;
  height: 30px;
  margin: 0px 0px;
  font-size: 16px
}
/* #imgheight{
  height: 400px;
  width: 600;
  margin: auto ;
} */

.images {
  height: 100%;
  display: flex;
  justify-content: center;
  align-content: center;
  align-items: center;
  flex-wrap: wrap;
  padding: 5px;

  .image-wrapper {
    display: inline-block;
    width: calc(33% - 20px);
    margin: 5px 5px 0 5px;

    .image {
      height: 100%;
      width: 25%;
      cursor: pointer;
      display: inline-block;
    }
  }
}

</style>