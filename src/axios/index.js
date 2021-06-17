/* 通过 qs 模块处理请求数据*/
import axios from "axios";

let protocol = window.location.protocol; //协议
let host = window.location.hostname; //主机
axios.defaults.baseURL = protocol + "//" + host  +":7090";
axios.defaults.withCredentials = true; // 若跨域请求需要带 cookie 身份识别
axios.defaults.headers.post["Access-Control-Allow-Origin-Type"] = "*"; // 允许跨域
// axios.defaults.headers.post["Content-Type"] =
//   // "application/x-www-form-urlencoded; charset=UTF-8"; // 请求头
//   "multipart/form-data; charset=UTF-8"; // 请求头
