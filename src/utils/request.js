import axios from "axios";
import Vue from "vue";
import store from "../store/index";

const service = axios.create({
  baseURL: "https://api.github.com",
  timeout: 15000
});

service.interceptors.request.use(
  config => {
    let token = store.state.token.token;
    if (token) {
      let sp = "?";
      if (config.url.indexOf("?") >= 0) {
        sp = "&";
      }
      config.url = config.url + sp + "access_token=" + token;
    }
    return config;
  },
  error => {
    console.log(error);
  }
);

service.interceptors.response.use(
  response => {
    let responseJson = response.data;
    console.log(responseJson);
    return response;
  },
  error => {
    let message;
    switch (error.response.status) {
      case 401:
        message = "Token错误";
        break;
      default:
        message = error.response.data.message;
        break;
    }
    Vue.prototype.$message({
      message: message,
      type: "error"
    });
    // eslint-disable-next-line prefer-promise-reject-errors
    return Promise.reject("error");
  }
);

export default service;
