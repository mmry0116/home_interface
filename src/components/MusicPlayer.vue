<template>
 
  <div id="musicPlayer"></div>
 
</template>

<script setup lang="ts"> 
import {ref ,onMounted ,onUnmounted} from 'vue'
import { baseURL } from "@/tool/configAxios";
import MusicPreset, { Analyze }  from 'xgplayer-music';
import Player from 'xgplayer';

let props = defineProps(['musicPath'])
let player:any;
let options ={
  id: 'musicPlayer',
  mediaType: 'audio',
  volume: 0.8,
  height: 50,
  width: 800,
  autoplay: true,
  url: baseURL + '/transfer/palyVideo.do?path=' + props.musicPath,
  presets: ['default',MusicPreset], // 如果要同时使用默认preset，那么配置是['default', MusicPreset]
  ignores: ['playbackrate'],
  controls: {
        initShow: true,
        mode: 'flex'
  },
  marginControls: true,
  videoConfig: {
    // crossOrigin: "anonymous"
  }
}
// 必须在onMounted 或 nextTick实例Xgplayer播放器
onMounted(() => {
  player = new Player( options );
  // player.crossOrigin = "anonymous";
  console.log(baseURL + '/transfer/palyVideo.do?path=' + props.musicPath)
});

onUnmounted(() => {
  // player.destroy()
})

</script>

<style scoped>
#mse {
  flex: auto;
}
</style>