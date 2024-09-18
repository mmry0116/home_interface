import File from '@/components/icon/File.vue';
import FileLock from '@/components/icon/FileLock.vue';
import Folder from '@/components/icon/Folder.vue';
import FolderLock from '@/components/icon/FolderLock.vue';
import Music from '@/components/icon/Music.vue';
import Video from '@/components/icon/Video.vue';
import Image from '@/components/icon/Image.vue';
// import { Image, Music, Video } from 'lucide-vue-next';
import { h } from 'vue';


export const labels = [
  {
    value: 'bug',
    label: 'Bug',
  },
  {
    value: 'feature',
    label: 'Feature',
  },
  {
    value: 'documentation',
    label: 'Documentation',
  },
]

export const types = [

  {
    value: 'directory',
    label: '文件夹',
    icon: h(Folder),

  },
  {
    value: 'file',
    label: '文件',
    icon: h(File),

  },
  {
    value: 'hide_directory',
    label: '隐藏文件夹',
    // icon: h('span', {}, 'hd'),
    icon: h(FolderLock, {}),

  },
  {
    value: 'hide_file',
    label: '隐藏文件',
    icon: h(FileLock),
  },
  {
    value: 'video',
    label: '视频',
    // icon: h('div', { class: {} }, h(Video, { class: 'h-6 w-6 p-0 ml-0' })),
    // icon: h('div', {}, h(Video, { class: 'h-5 w-6 p-0 ml-0' })),
    icon: h(Video),
  },
  {
    value: 'music',
    label: '音乐',
    // icon: h('div', {}, h(Music, { class: 'h-5 w-6 p-0 ml-0' })),
    icon: h(Music),
  },
  {
    value: 'image',
    label: '图片',
    // icon: h('div', {}, h(Image, { class: 'h-5 w-6 p-0 ml-0' })),
    icon: h(Image),
  },
]

export const priorities = [
  {
    label: 'Low',
    value: 'low',

  },
  {
    label: 'Medium',
    value: 'medium',

  },
  {
    label: 'High',
    value: 'high',

  },
]
