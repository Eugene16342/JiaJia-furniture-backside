import axios from "axios";

// 創建 Axios 實例
const api = axios.create({
  baseURL: "http://localhost:3001/api", // 後端伺服器的 API 地址
  withCredentials: true, // 允許攜帶憑證
  timeout: 10000, // 請求超時時間
});

// 請求攔截器
api.interceptors.request.use(
  (config) => {
    console.log("前端中間件 : 發送請求:", config);
    return config;
  },
  (error) => {
    console.error("請求錯誤:", error);
    return Promise.reject(error);
  }
);

// 響應攔截器
api.interceptors.response.use(
  (response) => {
    console.log("前端中間件 : 接收回應:", response);
    return response;
  },
  (error) => {
    console.error("回應錯誤:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default api;
