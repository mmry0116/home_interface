// declare module '@/tool/StreamSaver.js'
// declare module '@/tool/zip-stream.js'
import type { File } from '@/components/workspace/index'
import type { Row } from '@tanstack/vue-table'

interface a {
  row: Row<File>
}

//将路径转为一个组数
const pastPath = function (path: string): string[] {
  let arrPath: string[] = []
  path.split('/').forEach((e) => {
    arrPath.push(e)
  })
  if (arrPath[arrPath.length - 1] == '') {
    arrPath.pop()
  }
  return arrPath;
}

//将组数转为一个路径
export const pastPathArr = function (pathArr: string[]): string {
  let path = ''
  pathArr.forEach(p => {
    path = path + p + '/'
  })
  //将最后斜杠去掉
  if (path[path.length - 1] == '/') {
    // console.log('sssssssssss')
    path = path.substring(0, path.length - 1)
  }
  return path;
}

// 格式化文件大小 单位：Bytes、KB、MB、GB
function formatFileSize(fileSize: number) {
  var temp: string | number
  if (fileSize < 1024) {
    return fileSize + 'B';
  } else if (fileSize < (1024 * 1024)) {
    temp = (fileSize / 1024).toFixed(2);
    return temp + 'KB';
  } else if (fileSize < (1024 * 1024 * 1024)) {
    temp = (fileSize / (1024 * 1024)).toFixed(2);
    return temp + 'MB';
  } else {
    temp = (fileSize / (1024 * 1024 * 1024)).toFixed(2);
    return temp + 'GB';
  }
}

// export default pastPath
export { formatFileSize, pastPath }

