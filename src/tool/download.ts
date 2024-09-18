
import { dFile } from "@/components/workspace";
import { useDownloadStore } from "@/store/downloadStore";
import FileSaver from "file-saver";
import JSZip from "jszip";
// import { downloadSingleFiles, downloadSingleF } from "./useAxios";
import { baseURL } from "./configAxios";

let downloadStore: any
let zip: any
let cache = {};
var blogTitle: string  // 下载后压缩包的命名
let httpConnectCount = 2
let isSingle = false

//https://juejin.cn/post/7152797953688600583 
//https://blog.csdn.net/qq_47498423/article/details/131191964
//https://juejin.cn/post/6945758699189174308#heading-10
async function singleFileDownload(files: dFile[], connectCount?: number) {
  console.log(files)
  isSingle = files.length == 1 ? true : false
  blogTitle = files[0].name + '.zip'
  zip = new JSZip();
  if (connectCount) httpConnectCount = connectCount
  downloadStore = useDownloadStore()
  downloadStore.clearDownloadInfo()//清除downloadStore 中的数据
  downloadStore.downloadCount = files.length //设置总共下载文件数量
  downloadStore.dFiles = files
  downloadStore.$subscribe((a, status: any) => {
    console.log(status.compoleteSet.size, status.downloadCount)
    if (status.compoleteSet.size == status.downloadCount && !isSingle) {
      status.downloadCount = 0 //防止函数再次进入打包 
      const compoleteSet = downloadStore.compoleteSet
      blogTitle = compoleteSet.values().next().value + '等' + compoleteSet.size + '个文件' + '.zip'
      waitwait() //等一秒后再打包
      async function waitwait() {
        await sleep(1000)
        new Promise(() => {
          zip.generateAsync({ type: "blob" }).then((content) => {
            // 生成二进制流
            FileSaver.saveAs(content, blogTitle); // 利用file-saver保存文件  自定义文件名
          });
        }).then(() => {
          console.log('successful......')
        }, () => {
          alert('deafult')
        })
      }
    }
  })
  //可以同时和服务器有2个连接
  // for (; downloadStore.downloadingSet.length < httpConnectCount;) {
  //   const file = downloadStore.findTask()
  //   if (file == undefined) {
  //     console.log("下载任务没有到规定个数：", httpConnectCount)
  //     break
  //   }
  //   console.log('singleFileDownload添加任务', file.name)
  //   downloadStore.downloadingSet.add(file.name)
  //   downloadFiles(file.path, file.size, file.name)
  // }
  waitDownload()
}

function downloadFiles(path: string, size: number, name: string) {
  getArrayBuffer(path, size, name).then((data: any) => {
    //检测是否下载完成
    if (!downloadStore.cheackCompelete(name)) return
    console.log('添加文件到zip:' + data)
    // 下载文件, 并存成ArrayBuffer对象(blob)
    // zip.file(name, data, { binary: true }); // 逐个添加文件
    cache[name] = data;
    // console.log(downloadStore.compoleteSet, downloadStore.downloadingCount)
  });
}

//监听正在下载的数量 维持在3个
async function waitDownload() {
  let dCount = downloadStore.downloadCount;  //需要下载任务数量
  for (; ;) {
    //如果下载完毕则退出监听
    if (downloadStore.compoleteSet.size == dCount || dCount == 0) {
      console.log("需要退出2000", downloadStore.compoleteSet.size, dCount)
      await sleep(2000);
      // break
    }
    //判断正在下载文件数量是否大于httpConnectCount
    //任务队列满了就监听到有空闲位置
    if (downloadStore.downloadingSet.size >= httpConnectCount) {
      await sleep(1000);
      console.log("监听1000")
      continue
    }
    let ff = downloadStore.findTask()
    if (ff) {
      console.log('waitDownload添加下载任务: ', ff.name)
      downloadFiles(ff.path, ff.size, ff.name)
      downloadStore.downloadingSet.add(ff.name)
      continue
    }
    console.log("监听4000, 任务队列空闲并没有可下载任务")
    await sleep(4000);
  }
}

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function downloadSingle(blob: any, name: stirng) {
  console.log('downloadSingle')
  // let name = downloadStore.dFiles[0].name;
  // const file = new File([blob], name)
  // 创建FileReader实例
  const reader = new FileReader()
  // 传入被读取的blob对象
  reader.readAsDataURL(blob)
  // 读取完成的回调事件
  reader.onload = (e) => {
    let a: any = document.createElement('a')
    a.download = name
    a.style.display = 'none'
    // 生成的base64编码
    let url = reader.result
    a.href = url
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }
}

//文件以流的形式获取（参数url为文件链接地址）
function getArrayBuffer(path?: any, totalSize?: number, name?: string) {
  return new Promise((resolve, reject) => {
    //通过请求获取文件blob格式
    let xmlhttp = new XMLHttpRequest();
    let nowMill = new Date().getTime()
    let current;
    xmlhttp.open("GET", baseURL + '/download.do?filePath=' + path, true);
    xmlhttp.responseType = "blob";
    xmlhttp.withCredentials = true;
    xmlhttp.onload = function () {
      if (this.status == 200) {
        console.log(this.response)
        resolve(this.response);
      } else {
        console.log('请求状态码：', this.status)
        reject(this.status);
      }
    };
    xmlhttp.onprogress = (progress: any) => {
      current = new Date().getTime()
      if (current - nowMill > 1000) {
        nowMill = current
        let precent = Math.round((progress.loaded / progress.total) * 100)
        downloadStore.modifydownloadInfo(name, precent)
        console.log(precent, name)
      }
      // if (progress.loaded == progress.total) {
      //   downloadStore.downloadingSet.delete(name)
      //   downloadStore.compoleteSet.add(name)
      //   downloadStore.modifydownloadInfo(name, 100)
      //   downloadStore.flush += 1
      //   console.log("完成", name)
      // }
    };
    xmlhttp.onerror = e => {
      downloadStore.downloadingSet.delete(name)
      console.log(e, name, ": 下载失败...")
      downloadStore.modifydownloadInfo(name, undefined, 'fail')

    }
    xmlhttp.onloadstart = e => { console.log('xmlhttp.onloadstart') }
    xmlhttp.onloadend = function (e) {
      console.log('onloadend...')
      downloadStore.downloadingSet.delete(name)
      downloadStore.compoleteSet.add(name)
      downloadStore.modifydownloadInfo(name, 100)
      downloadStore.flush += 1
      // console.log("完成", name, this.response)
      //如果是单个下载就不打包zip
      console.log('xmlhttp.onloadend')
      if (isSingle) {
        downloadSingle(this.response, name)
        return
      }
      zip.file(name, this.response, { binary: true }); // 逐个添加文件
    }

    xmlhttp.send();
  })
  // .then((res) => {
  //   console.log('userAxios-res: ', res)
  //   return new Promise((resolve) => {
  //     resolve(res)
  //   })
  // })

  // .catch(e => {
  //   downloadStore.downloadingSet.delete(name)
  //   console.log(e, name, ": 下载失败...")
  //   downloadStore.modifydownloadInfo(name, undefined, 'fail')

  // })
}

export { singleFileDownload };

