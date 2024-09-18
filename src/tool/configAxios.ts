import axios from 'axios';
import router from "@/router/index.ts"
// const router = useRouter();
// const baseURL = 'http://' + window.location.hostname + ':' + 8221 + '/home';
const baseURL = import.meta.env.VITE_baseURL
// console.log(baseURL)
//https://zhuanlan.zhihu.com/p/509680724
//https://juejin.cn/post/6945758699189174308#heading-10
const serviceAxios = axios.create({
  baseURL,
  timeout: 3000,
  withCredentials: true, // 跨域请求是否需要携带 cookie
})

// request 拦截器
serviceAxios.interceptors.request.use(
  (config) => {
    // 如果开启 token 认证
    // if (serverConfig.useTokenAuthorization) {
    //   config.headers["Authorization"] = localStorage.getItem("token"); // 请求头携带 token
    // }
    // 设置请求头
    if (!config.headers["content-type"]) { // 如果没有设置请求头
      if (config.method === 'post') {
        // config.headers["content-type"] = "application/x-www-form-urlencoded"; // post 请求
        config.data = JSON.stringify(config.data); // 序列化,比如表单数据
      } else {
        config.headers["content-type"] = "application/json"; // 默认类型
      }
    }
    return config;
  },
  // (error) => {
  //   // Promise.reject(error);
  //   console.log(error)
  //   // 请求错误时
  //   console.log('request:', error)
  //   // 1. 判断请求超时
  //   if (error.code === 'ECONNABORTED' && error.message.indexOf('timeout') !== -1) {
  //     console.log('timeout请求超时')
  //     // return service.request(originalRequest);// 再重复请求一次
  //   }
  //   // 2. 需要重定向到错误页面
  //   const errorInfo = error.response
  //   console.log(errorInfo)
  //   if (errorInfo) {
  //     error = errorInfo.data  // 页面那边catch的时候就能拿到详细的错误信息,看最下边的Promise.reject
  //     const errorStatus = errorInfo.status; // 404 403 500 ...
  //     router.push({
  //       path: `/error/${errorStatus}`
  //     })
  //   }
  //   return Promise.reject(error) // 在调用的那边可以拿到(catch)你想返回的错误信息
  // }
);

// response 拦截器
serviceAxios.interceptors.response.use(
  response => {
    let data;
    // IE9时response.data是undefined，因此需要使用response.request.responseText(Stringify后的字符串)
    if (response.data == undefined) {
      data = JSON.parse(response.request.responseText)
    } else {
      data = response.data
    }
    //认证失败就跳转首页
    if (data.code == '401') {
      console.log(data.code == '401')
      router.replace({ path: '/' })
      return
    }
    // 根据返回的code值来做不同的处理
    switch (data.rc) {
      case 1:
        console.log(data.desc)
        break;
      case 0:
      // store.commit('changeState')
      // console.log('登录成功')
      default:
    }
    // 若不是正确的返回code，且已经登录，就抛出错误
    // const err = new Error(data.desc)
    // err.data = data
    // err.response = response
    // throw err
    return data
  },
  // err => {
  //   if (err && err.response) {
  //     switch (err.response.status) {
  //       case 400:
  //         err.message = '请求错误'
  //         break
  //       case 401:
  //         err.message = '未授权，请登录'
  //         break
  //       case 403:
  //         err.message = '拒绝访问'
  //         break
  //       case 404:
  //         err.message = `请求地址出错: ${err.response.config.url}`
  //         break
  //       case 408:
  //         err.message = '请求超时'
  //         break
  //       case 500:
  //         // err.message = '服务器内部错误'
  //         let res = JSON.parse(err.response.request.response);
  //         debugger
  //         if (res.error == 'Internal Server Error') {
  //           msgInvalidLogin(res.message);
  //         }
  //         err.message = '服务器内部错误'
  //         break
  //       case 501:
  //         err.message = '服务未实现'
  //         break
  //       case 502:
  //         err.message = '网关错误'
  //         break
  //       case 503:
  //         err.message = '服务不可用'
  //         break
  //       case 504:
  //         err.message = '网关超时'
  //         break
  //       case 505:
  //         err.message = 'HTTP版本不受支持'
  //         break
  //       default:
  //     }
  //   }
  //   console.error(err)
  //   return Promise.reject(err) // 返回接口返回的错误信息
  // }
)

function msgInvalidLogin(msg: object) {
  //使用组件弹出提示信息
  // Message.error(msg);

  let second = 3;
  const timer = setInterval(() => {
    second--;
    if (second) {
    } else {
      clearInterval(timer);

      // store.dispatch('LogOut').then(() =>{
      //   location.reload()// In order to re-instantiate the vue-router object to avoid bugs
      // })
    }
  }, 1000);
}

export { baseURL, serviceAxios };

