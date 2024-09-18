import { updatePathOnlyFolder } from '@/tool/useAxios'
import { defineStore } from 'pinia'
import { pastPath } from '@/tool/mmryUtil'
import { ref } from 'vue'
import { useDataStore } from './data'


export const useDialogDataStore = defineStore('dialogDataStore', () => {
  const folderNameData = ref<any>(
  )

  const dataStroe = useDataStore()
  const drivers = ref<string[]>(
    dataStroe.drivers!
  )
  //存放着 路径数组
  const pathArr = ref<string[]>(
  )

  async function updateDialogData(pathParam?: string, flag?: number) {
    //如果是不传入值 就是刚刚进入界面
    //如果是选择盘符更新 就匹配：
    //如果flag=1 则是点击路径更新 
    //如果flag=2 则是点击文件夹 
    //如果flag=3 则是不需要处理路径 

    //刚刚进入界面
    // console.log('dialogDataStore... updateData')
    // console.log(pathParam)
    if (pathParam == '' || pathParam == undefined) {
      if (drivers.value.length >= 2) {
        pathParam = drivers.value[1] + '/'
      } else
        pathParam = drivers.value[0] + '/'
      pathArr.value = [pathParam]
    } else if (flag == 3) {//如果flag=3 则是不需要处理路径 

    } else if (pathParam?.indexOf(":") >= 0) { //如果是选择盘符更新 就匹配：
      console.log(pathParam?.indexOf(":"))
      // pathParam += '/'
    } else if (flag == 1) { //如果是点击路径更新 就从pathArr 中匹配
      let p = ''
      for (let i = 0; ; i++) {
        p = p + pathArr.value![i] + '/'
        if (pathArr.value![i].indexOf(pathParam!) >= 0 || i + 1 == pathArr.value?.length) {
          break
        }
      }
      pathParam = p
    } else {//如果flag=2 则是点击文件夹 
      let p = ''
      for (let i = 0; i < pathArr.value?.length!; i++) {
        p = p + pathArr.value![i] + '/'
      }
      pathParam = p + pathParam
    }

    console.log('updateData: ', pathParam)
    await updatePathOnlyFolder(pathParam).then((retData: any) => {
      // console.log(retData)
      folderNameData.value = retData.folderNames
      pathArr.value = pastPath(pathParam!);
    }).catch((error) => {
      console.log(error)
    })

  }

  return { folderNameData, updateDialogData, drivers, pathArr }
})