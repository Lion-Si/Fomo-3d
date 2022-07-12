// import message from "./Message";

// const BASE_URL = process.env.REACT_APP_PUBLIC_URL; // 固定域名端口

const codeMessage = {
  200: "成功返回请求的数据。",
  201: "新建或修改数据成功。",
  202: "一个请求已经进入后台排队（异步任务）。",
  204: "删除数据成功。",
  304: "请求的资源未修改，服务器返回此状态码时",
  400: "发出的请求有错误，服务器没有进行新建或修改数据的操作。",
  401: "用户没有权限（令牌、用户名、密码错误）。",
  403: "用户得到授权，但是访问是被禁止的。",
  404: "发出的请求针对的是不存在的记录，服务器没有进行操作。",
  406: "请求的格式不可得。",
  410: "请求的资源被永久删除，且不会再得到的。",
  422: "当创建一个对象时，发生一个验证错误。",
  500: "服务器发生错误，请检查服务器。",
  502: "网关错误。",
  503: "服务不可用，服务器暂时过载或维护。",
  504: "网关超时。",
};

/**
 * 将fetch进行一些简单的封装，简化请求流程
 * @param {object} options 传入的是对象属性
 * @returns 返回对应的请求结果（当值报错时则返回对应的错误信息）
 */
const RequestHandle = (options) => {
  return new Promise((resolve, reject) => {
    fetch(`${options.url}`, {
      method: options?.method,
      body: options?.data,
      responseType: "json",
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
    })
      .then((res) => {
        if (!res.ok) {
          return Promise.reject({
            status: res.status,
            statusText: res.statusText,
            errorText: res.json(),
          });
        }
        return res.json();
      })
      .then((resData) => {
        resolve(resData);
      })
      .catch((error) => {
        // 错误处理
        const response = error;
        const errorText = codeMessage[response?.status] || response?.statusText;
        const { status } = response;
        if (response.status === 401) {
          // message.error(`${status}:${errorText}`);
        } else {
          error?.errorText?.then((err) => {
            console.log(err,typeof err);
            if (typeof err === "object") {
              // message.error(err?.data || err?.msg);
            } else {
              // message.error(err);
            }
          });
        }
        reject(error);
      });
  });
};

/**
 *
 * @param {Object} options 接受一个对象(fetch接受的任意参数作为其属性)
 * @returns
 */
const Fetch = (url, options) => {
  return RequestHandle({
    method: options?.method,
    url: url,
    data: options?.body,
  });
};

// 通用请求方法Fetch
export default Fetch;
