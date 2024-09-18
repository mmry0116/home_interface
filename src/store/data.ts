import { download, updatePath } from '@/tool/useAxios'
import { defineStore } from 'pinia'
// import {nanoid} from 'nanoid'
import { pastPath } from '@/tool/mmryUtil'
import { ref } from 'vue'
import { useUserStore } from '@/store/user';


export const useDataStore = defineStore('dataStroe', () => {
  let userStore = useUserStore()
  // talkList就是state
  const fileData = ref<any>()
  const drivers = ref<string[]>()
  //存放着 路径数组
  const path = ref<string[]>()

  //是否需要重置复选框状态
  const isFlushCheckbox = ref<boolean>(
    false
  )

  // getATalk函数相当于action
  async function initData() {
    console.log('initData....')
    await download().then((retData) => {
      let fileD = retData.data
      drivers.value = retData.drivers
      fileData.value = fileD
      path.value = pastPath(fileD[0].path.substring(0, fileD[0].path.length - 1) as string)
      // console.log(drivers.value)
    })
    if (fileData.value.length > 0)
      userStore.isLogin = true;
  }

  async function updateData(pathParam: string, flag?: number) {

    //如果flag 是1 表示需要路径重写
    // console.log(flag != undefined && flag == 1)
    if (flag != undefined && flag == 1) {
      let p = ''
      for (let i = 0; ; i++) {
        p = p + path.value![i] + '/'
        // console.log(i, path.value![i],)
        if (path.value![i + 1] == undefined || path.value![i].indexOf(pathParam) >= 0) break

      }
      pathParam = p

    }

    console.log('updateData: ', pathParam)
    await updatePath(pathParam).then((retData: any) => {
      let fileD = retData.data
      fileData.value = fileD
      path.value = pastPath(pathParam)
    }).catch((error) => {
      console.log(error)
    })

    //刷新复选框状态
    isFlushCheckbox.value = true;

    if (fileData.value.length > 0)
      userStore.isLogin = true;

  }

  return { fileData, updateData, drivers, initData, path, isFlushCheckbox }
})