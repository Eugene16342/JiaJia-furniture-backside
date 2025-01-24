import { createRouter, createWebHistory } from "vue-router";
import { use_auth_store } from "./stores/index";

const routes = [
  {
    path: "/",
    name: "login_page",
    component: () => import("./pages/login_page.vue"),
  },
  {
    path: "/home",
    name: "home_page",
    component: () => import("./pages/home_page.vue"),
  },
  {
    path: "/permissions",
    name: "permission_page",
    component: () => import("./pages/premission_page.vue"),
    children: [
      {
        path: "/permissions/admin_management",
        name: "admin_management",
        component: () => import("./components/permission/admin_management.vue"),
      },
      {
        path: "/permissions/serach_admin",
        name: "serach_admin",
        component: () => import("./components/permission/serach_admin.vue"),
      },
      {
        path: "/permissions/permission_control",
        name: "permission_control",
        component: () =>
          import("./components/permission/permission_control.vue"),
      },
      {
        path: "/permissions/change_permission",
        name: "change_permission",
        component: () =>
          import("./components/permission/change_permission.vue"),
      },
    ],
  },
  {
    path: "/users",
    name: "user_page",
    component: () => import("./pages/user_page.vue"),
  },
  {
    path: "/products",
    name: "product_page",
    component: () => import("./pages/product_page.vue"),
  },
  {
    path: "/data_sales",
    name: "sales_page",
    component: () => import("./pages/sales_page.vue"),
  },
  {
    path: "/data_revenue",
    name: "revenue_page",
    component: () => import("./pages/revenue_page.vue"),
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
