import { createRouter, createWebHistory } from "vue-router";
import { use_auth_store } from "./stores/index";

import login_page from "./pages/login_page.vue";
import permission_page from "./pages/premission_page.vue";
import user_page from "./pages/user_page.vue";
import product_page from "./pages/product_page.vue";
import sales_page from "./pages/sales_page.vue";
import revenue_page from "./pages/revenue_page.vue";
import home_page from "./pages/home_page.vue";

const routes = [
  {
    path: "/",
    name: "login_page",
    component: login_page,
  },
  {
    path: "/home",
    name: "home_page",
    component: home_page,
  },
  {
    path: "/permissions",
    name: "permission_page",
    component: permission_page,
  },
  {
    path: "/users",
    name: "user_page",
    component: user_page,
  },
  {
    path: "/products",
    name: "product_page",
    component: product_page,
  },
  {
    path: "/data_sales",
    name: "sales_page",
    component: sales_page,
  },
  {
    path: "/data_revenue",
    name: "revenue_page",
    component: revenue_page,
  },
];

// 創建 router 實例
const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to, from, next) => {
  const auth_store = use_auth_store();

  // 先檢查登入狀態
  if (!auth_store.isLogin) {
    await auth_store.check_login();
  }

  // 登入情況下禁止回到登入頁
  if (to.name === "login_page" && auth_store.isLogin) {
    return next("/home");
  }

  if (to.name !== "login_page" && !auth_store.isLogin) {
    return next("/");
  }

  next();
});

export { router };
