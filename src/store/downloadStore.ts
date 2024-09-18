import { dFile } from '@/components/workspace'
import { file } from 'jszip'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useDownloadStore = defineStore('downloadStroe', () => {
  // talkList就是state
  const dFiles = ref<dFile[]>()
  const downloadingSet = ref<Set<string>>(new Set<string>())
  const downloadCount = ref<number>(0)
  const flush = ref<number>(0)
  const compoleteSet = ref<Set<string>>(new Set<string>())
  compoleteSet.value.values().next().value

  function clearDownloadInfo() {
    dFiles.value = []
    downloadCount.value = 0
    flush.value = 0
    downloadingSet.value.clear()
    compoleteSet.value.clear()
  }

  function failCount(): number {
    let count = 0;
    dFiles.value?.forEach(f => {
      if (f.status && f.status == 'fail')
        count++
    })
    return count
  }

  //修改状态或者 下载进度
  async function modifydownloadInfo(name: string, precent?: number, status?: string) {
    dFiles.value?.forEach(file => {
      if (file.name == name && precent != undefined) {
        file.precent = precent;
      }
      if (file.name == name && status != undefined) {
        console.log('file.status ', file.status)
        if (file.status == undefined) {
          file.status = status;
        } else {
          downloadCount.value -= 1 //两次下载失败就取消下载
          console.log('两次下载失败就取消下载')
        }
      }
    })
  }
  function findTask(): dFile | undefined {
    let task: undefined | dFile = undefined;
    dFiles.value?.find(file => {
      //如果没有下载进度 且 任务列表没有
      if (!file.precent && !downloadingSet.value.has(file.name)) {
        task = file
        return true
      }
      //下载失败了再次尝试下载
      if (file.precent && file.status == 'fail') {
        file.status = 'failfail'
        task = file
        return true;
      }
    })
    return task
  }

  // async function waitwait(name: string): boolean {
  //   let flag = false
  //   await setTimeout(() => {
  //     dFiles.value?.forEach(file => {
  //       if (file.name == name && file.status == 'fail')
  //         flag = true
  //     })
  //   }, 500);
  //   return flag
  // }
  function cheackCompelete(name: string) {
    return dFiles.value?.find(file => {
      if (file.name == name && file.precent == 100)
        return true
    })
  }

  return {
    dFiles, downloadingSet, downloadCount, compoleteSet, flush,
    clearDownloadInfo, modifydownloadInfo, failCount, cheackCompelete, findTask
  }
})