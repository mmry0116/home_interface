<template>
  <div id="player"></div>
</template>

<script setup lang="ts"> 
import { onMounted, onUnmounted } from "vue";
import Player from 'xgplayer';
import {Sniffer } from 'xgplayer';
import "xgplayer/dist/index.min.css";
import { baseURL } from "@/tool/configAxios";
// import FlvPlugin from 'xgplayer-flv'
// import HlsPlugin from 'xgplayer-hls'   
// import Mp4Plugin from 'xgplayer-mp4'


let props = defineProps(['videoPath'])
const playerOpts =  {
  id: "player", //元素id
  // url: "/acc.mp4", //视频地址
  url: baseURL + '/transfer/palyVideo.do?path=' + props.videoPath,
  // poster: "../../public/bg.jpeg", //封面图
  lang: "zh-cn", //设置中文
  // plugins: [Mp4Plugin], //插件
  // mp4plugin: {
  //       maxBufferLength: 30,
  //       minBufferLength: 10,
  //       reqOptions:{
  //           mode: 'cors',
  //           method: 'POST',
  //           headers: { // 需要带的自定义请求头
  //               'x-test-header': 'rrrr'
  //           },
  //       }
  //       // ... 其他配置
  //   },
  lastPlayTime: 0, //视频起播时间（单位：秒）
  lastPlayTimeHideDelay: 5, //提示文字展示时长（单位：秒）
  closeVideoClick: false, // true - 禁止pc端单击暂停，反之
  closeVideoTouch: true, // true - 禁止移动端单击暂停，反之
  videoInit: true,
  fluid: true, //填满屏幕
  width: 800,
  height: 600,
  // height: window.innerHeight,
  // width: window.innerWidth,
  autoplay: true, //自动播放
  loop: false, //循环播放
  // reload: true,
  pip: true,
  volume: 1, //音量 0 -  1
  playbackRate: [0.5, 0.75, 1, 1.5, 2], //传入倍速可选数组
  // 删除控件
  // ignores: ['time', 'definition', 'error', 'fullscreen', 'i18n', 'loading', 'mobile', 'pc', 'play', 'poster', 'progress', 'replay', 'volume'],
  // ignores: ["volume"],
  rotateFullscreen: true, 
  rotate: true, //反转 
  // download: true
} 
 
let player:any = null;

// 必须在onMounted 或 nextTick实例Xgplayer播放器
onMounted(() => {
  player = new Player(playerOpts);
  console.log( Sniffer.isSupportMP4())
  // player.registerPlugin(Mp4Plugin)
});

onUnmounted(() => {
  player.destroy()
   
})

</script>

<style scoped>
#mse {
  flex: auto;
}
</style>