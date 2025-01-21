import { defineStore } from "pinia";
import api from "../utils/api";
import { ElNotification } from "element-plus";
import { reactive } from "vue";

export const use_auth_store = defineStore("auth", {
  state: () => ({
    admin: reactive({
      admin_id: null,
      name: null,
      role_id: null,
      role_name: null,
    }),
    isLogin: false,
  }),
  actions: {
    // 登入
    async login(admin_id, password) {
      if (!admin_id || !password) {
        ElNotification({
          title: "登入失敗",
          message: "請輸入ID和密碼",
          type: "warning",
        });
        return false;
      }
      try {
        const res = await api.post("/auth/login", {
          admin_id,
          password,
        });

        this.isLogin = true;
        this.admin = res.data.admin;

        console.log(this.admin);

        ElNotification({
          title: "登入成功",
          message: `歡迎${this.admin.name}`,
          type: "success",
        });
        return true;
      } catch (error) {
        if (error.response?.status === 401) {
          ElNotification({
            title: "登入失敗",
            message: "ID或密碼錯誤",
            type: "warning",
          });
          return false;
        }

        console.error("登入時出現錯誤!", error);
        return false;
      }
    },

    // 初始化登入狀態
    async check_login() {
      try {
        const res = await api.get("auth/check_login");
        this.isLogin = true;
        this.admin = res.data.admin;
        return 200;
      } catch (error) {
        this.isLogin = false;
        this.admin = {
          admin_id: null,
          name: null,
          role_id: null,
          role_name: null,
        };
        if (error.response?.status === 401) {
          return 401; // 未登入
        }

        console.error("初始化登入狀態時出現錯誤!", error);
        ElNotification({
          title: "伺服器錯誤",
          message: "無法檢查登入狀態，請稍後再試",
          type: "error",
        });
        return 500;
      }
    },

    // 登出
    async logout() {
      try {
        const res = await api.post("/auth/logout");
        if (res.status === 200) {
          this.isLogin = false;
          this.admin = {
            admin_id: null,
            name: null,
            role_id: null,
            role_name: null,
          };
          window.location.reload();
        }
      } catch (error) {
        console.error("登出失敗!", error);
        ElNotification({
          title: "登出失敗",
          message: "伺服器錯誤，請稍後再試。",
          type: "error",
        });
      }
    },
  },
  getters: {
    // 判斷身分權限
    isAdmin: (state) => state.admin.role_id == 1,
    isNormal: (state) => state.admin.role_id == 2,

    // 高階主管有部分相同權限時
    // isExecutive: (state) => ["1", "3"].includes(state.admin.role_id),
  },
});
