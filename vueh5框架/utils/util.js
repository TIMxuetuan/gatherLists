import axios from "axios"; // 引入axios
import MD5 from "js-md5";
// import QS from 'qs'; // 引入qs模块，用来序列化post类型的数据
// vant的toast提示框组件，大家可根据自己的ui组件更改。
// import { Toast } from 'vant';

axios.defaults.timeout = 5000; //响应时间

//配置请求头

axios.defaults.headers.post["Content-Type"] =
  "application/x-www-form-urlencoded;charset=UTF-8";

axios.defaults.baseURL = ""; //配置接口地址

//POST传参序列化(添加请求拦截器)
axios.interceptors.request.use(
  config => {
    //在发送请求之前做某件事
    if (config.method === "post") {
      // config.data = QS.stringify(config.data);
    }
    return config;
  },
  error => {
    console.log("错误的传参");
    return Promise.reject(error);
  }
);

//返回状态判断(添加响应拦截器)
axios.interceptors.response.use(
  res => {
    //对响应数据做些事
    if (res.data.ResponseStatus == 401) {
      // _this.$router.push("/login")
      // localStorage.setItem("token", "");
      // localStorage.setItem("userInfo", "");
    }
    localStorage.setItem("timeout", Date.now() + 1000 * 60 * 30);
    return res;
  },
  error => {
    console.log("网络异常");
    return Promise.reject(error);
  }
);

//返回一个Promise(发送post请求)

// 参数转换
const param2String = data => {
  // console.log("data", data);
  if (typeof data === "string") {
    return data;
  }
  let ret = "";
  for (let it in data) {
    let val = data[it];
    if (
      typeof val === "object" && //
      (!(val instanceof Array) ||
        (val.length > 0 && typeof val[0] === "object"))
    ) {
      val = JSON.stringify(val);
    }
    ret += it + "=" + encodeURIComponent(val) + "&";
  }
  if (ret.length > 0) {
    ret = ret.substring(0, ret.length - 1);
  }
  // console.log(ret);
  return ret;
};

//进行加密
const getConfig = (isjson, params, jiamiData, level) => {
  const suffix = "zhongjianedu";
  // console.log(isjson, params, level, jiamiData)
  // 时间戳
  if (level === 1) {
    params = {
      encrypt: MD5(JSON.stringify(params))
    }; // 加密
  } else if (level === 2) {
    //注意：登陆时用户信息需要加密，所以拼接在签名中；后续接口参数不需要加密，就不需要拼接如签名
    let timestamp = new Date().getTime();
    // 获取token
    let token = "";
    // 签名串
    var obj = {};

    obj["timestamp"] = timestamp;
    if (token != "") {
      obj["token"] = token || "";
    }

    for (var key in jiamiData) {
      var reg = /\[(.+?)\]/;
      if (key.match(reg)) {
        obj[RegExp.$1] = jiamiData[key];
      } else {
        obj[key] = jiamiData[key];
      }
    }

    const reverse_key = Object.keys(obj).sort();
    let resource_code =
      reverse_key
        .reduce((rst, v) => (rst += `${v}=${obj[v]}&`), "")
        .slice(0, -1) + suffix;
    console.log(resource_code);
    let sign = MD5(resource_code);
    // console.log("resource_code", resource_code);

    params["timestamp"] = timestamp;
    params["sign"] = sign;
    console.log("时间戳", timestamp);
    console.log("字符串", resource_code);
    console.log("签名", sign);
  }
  // 表单提交参数
  if (isjson) {
    params = param2String(params);
  }
  return params;
};

let _post = function(url, params, jiamiData, level, message = "") {
  if (!message && typeof message === "string") {
    console.log(message);
  }
  let dataParams = getConfig(true, params, jiamiData, level);
  return new Promise((resolve, reject) => {
    // 在此位置配置请求头目的在于对每次的请求都调用一次token，以防止token失效
    // axios.defaults.headers.common["token"] = localStorage.getItem("token");
    axios
      .post(url, dataParams)
      .then(
        response => {
          resolve(response.data);
        },
        err => {
          reject(err.data);
        }
      )
      .catch(error => {
        reject(error);
      });
  });
};

////返回一个Promise(发送get请求)

let _get = function(url, params, jiamiData, level, message = "") {
  if (!message && typeof message === "string") {
    console.log(message);
  }
  return new Promise((resolve, reject) => {
    let dataParams = getConfig("false", params, jiamiData, level);
    axios
      .get(url, { params: dataParams })
      .then(
        response => {
          resolve(response.data);
        },
        err => {
          reject(err.data);
        }
      )
      .catch(error => {
        reject(error);
      });
  });
};

export { _get, _post };
