import { useDownloadStore } from "@/store/downloadStore";
import { serviceAxios } from "./configAxios";

// 登录接口
export const login = (data: any) => {
  return serviceAxios({
    url: "/dologin.do",
    method: "post",
    params: data,
    headers: { 'content-Type': 'application/json' },
    withCredentials: true,
    timeout: 10000
  });
};

// 登出接口
export const logout = (data: any) => {
  return serviceAxios({
    url: "/logout.do",
    method: "get",
    params: data,
    headers: { 'content-Type': 'application/json' },
    withCredentials: true,
    timeout: 10000
  });
};


export const updatePath = (params?: any) => {
  return serviceAxios({
    url: "/transfer/updatePath.do",
    method: "post",
    params: {
      path: params
    },
    withCredentials: true
    // headers: {
    //   'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    // }
  });
};


export const updatePathOnlyFolder = (params?: any) => {
  return serviceAxios({
    url: "/transfer/updatePathOnlyFolder.do",
    method: "post",
    params: {
      path: params
    },
    withCredentials: true
  });
};

export const createFolder = (params?: any) => {
  return serviceAxios({
    url: "/transfer/createFolder.do",
    method: "post",
    params: {
      folderPath: params
    },
    withCredentials: true
  });
};

//workspace 初始化时候访问的接口 
export const download = (param?: any) => {
  return serviceAxios({
    url: "/transfer/download.do",
    method: "post",
    params: {
      path: param
    },
    withCredentials: true
    // headers: { 'Content-Type': 'application/json' },
  });
};

//未被使用
export const downloadSingleF = (param?: any) => {
  return serviceAxios({
    url: "/download.do",
    method: "post",
    params: {
      filePath: param
    },
    responseType: 'blob',
  });
};

//filePath string[] targetPath string
export const shearFile = (param?: any) => {
  return serviceAxios({
    url: "/transfer/shear.do?" + param,
    method: "post",
    // params: param,
    withCredentials: true,
    timeout: 0,
  });
};

export const deleteFile = (param?: any) => {
  return serviceAxios({
    url: "/transfer/delete.do?" + param,
    method: "post",
    // params: param,
    withCredentials: true
  });
};

let downloadStore: any
export const downloadSingleFiles = (path?: any, totalSize?: number, name?: string) => {
  downloadStore = useDownloadStore()
  let nowMill = new Date().getTime()
  let current;

  return serviceAxios({
    url: "/download.do",
    method: "get",
    params: {
      filePath: path
    },
    responseType: 'blob',//会被限制 报Network Error错误
    // responseType: 'arraybuffer',//会被限制 报Network Error错误
    timeout: 0,
    withCredentials: true,
    onDownloadProgress(progress) {
      current = new Date().getTime()
      if (current - nowMill > 1000) {
        nowMill = current
        let precent = Math.round((progress.loaded / progress.total) * 100)
        downloadStore.modifydownloadInfo(name, precent)
        console.log(precent, name)
      }
      if (progress.loaded == progress.total) {
        downloadStore.downloadingSet.delete(name)
        downloadStore.compoleteSet.add(name)
        downloadStore.modifydownloadInfo(name, 100)
        downloadStore.flush += 1
        console.log("完成", name)
      }
    },

  })
    .then((res) => {
      console.log('userAxios-res: ', res)
      return new Promise((resolve) => {
        resolve(res)
      })
    })

    .catch(e => {
      downloadStore.downloadingSet.delete(name)
      console.log(e, name, ": 下载失败...")
      downloadStore.modifydownloadInfo(name, undefined, 'fail')

    })


};

