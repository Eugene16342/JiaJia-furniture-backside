import { createApp } from "vue";
import { createPinia } from "pinia";
import { router } from "./routes";
import ElementPlus from "element-plus";
import "../src/assets/base.scss";
import * as ElementPlusIconsVue from "@element-plus/icons-vue";

import "element-plus/dist/index.css";
import App from "./App.vue";

const pinia = createPinia();
const app = createApp(App);

// 註冊 Pinia 和路由
app.use(pinia);
app.use(router);

// 註冊 Element Plus
app.use(ElementPlus);

// 全局註冊 Element Plus Icons
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component); // 全局註冊所有圖標
}

// 掛載應用
app.mount("#app");
