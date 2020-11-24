let debug = "popup"; //production development
let host_ip = {
  popup: "https://www.zjtaoke.cn" //接口ip 正式服务器
};

let host = host_ip[debug];
let api = host;

let _CONFIG = {
  api: api
};

module.exports = { _CONFIG };
