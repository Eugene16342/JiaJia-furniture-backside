import { createRouter, createWebHistory } from "vue-router";
import { use_auth_store } from "./stores/index";

const routes = [
  {
    // 登入頁
    path: "/",
    name: "login_page",
    component: () => import("./pages/login_page.vue"),
  },

  {
    // 主頁
    path: "/home",
    name: "home_page",
    component: () => import("./pages/home_page.vue"),
  },
  {
    // 權限控制 => 人員 權限
    path: "/permissions",
    name: "permission_page",
    component: () => import("./pages/premission_page.vue"),
    children: [
      {
        // 人員 => 新增人員
        path: "/permissions/admin_management",
        name: "admin_management",
        component: () => import("./components/permission/admin_management.vue"),
      },
      {
        // 人員 => 人員一覽
        path: "/permissions/serach_admin",
        name: "serach_admin",
        component: () => import("./components/permission/serach_admin.vue"),
      },
      {
        // 權限 => 更改角色權限
        path: "/permissions/permission_control",
        name: "permission_control",
        component: () =>
          import("./components/permission/permission_control.vue"),
      },
      {
        // 權限 => 新增角色
        path: "/permissions/change_permission",
        name: "change_permission",
        component: () =>
          import("./components/permission/change_permission.vue"),
      },
    ],
  },
  {
    // 會員操作 => 會員
    path: "/users",
    name: "user_page",
    component: () => import("./pages/user_page.vue"),
    children: [
      {
        // 會員 => 會員資料
        path: "/users/user_data",
        name: "user_data",
        component: () => import("./components/user/user_data.vue"),
      },
      {
        // 會員 => 訂單一覽
        path: "/users/order_data",
        name: "order_data",
        component: () => import("./components/user/order_data.vue"),
      },
    ],
  },
  {
    // 商品操作 =>
    path: "/products",
    name: "product_page",
    component: () => import("./pages/product_page.vue"),
    children: [
      {
        // 商品操作 => 商品一覽
        path: "/products/product_data",
        name: "product_data",
        component: () => import("./components/product/prouct_data.vue"),
      },
      {
        // 商品操作 => 新增商品
        path: "/products/create_product",
        name: "create_product",
        component: () => import("./components/product/create_product.vue"),
      },
      {
        // 商品操作 => 編輯商品
        path: "/products/edit_product",
        name: "edit_product",
        component: () => import("./components/product/edit_product.vue"),
      },
    ],
  },
  {
    // 數據分析 => 銷量
    path: "/data_sales",
    name: "sales_page",
    component: () => import("./pages/sales_page.vue"),
  },
  {
    // 數據分析 => 營業額
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
