<template>
  <el-container style="height: 100vh">
    <!-- 側邊欄 -->
    <el-aside v-if="auth_store.isLogin" width="250px" class="aside">
      <el-menu
        style="height: 100%"
        :default-active="$route.path"
        class="el-menu-vertical-demo"
        @select="handle_select"
      >
        <div class="who">
          <div class="role">{{ auth_store.admin.role_name }}</div>
          <div>{{ auth_store.admin.name }}</div>
        </div>

        <!-- 動態渲染選單 -->
        <template v-for="item in auth_store.menu" :key="item.path">
          <el-menu-item
            v-if="!item.children || item.children.length === 0"
            :index="item.path"
          >
            <component :is="item.icon" />
            <template #title>{{ item.title }}</template>
          </el-menu-item>

          <el-sub-menu v-else :index="item.path">
            <template #title>
              <component :is="item.icon" />
              <span>{{ item.title }}</span>
            </template>
            <el-menu-item
              v-for="subItem in item.children"
              :key="subItem.path"
              :index="subItem.path"
            >
              <component :is="subItem.icon" />
              <template #title>{{ subItem.title }}</template>
            </el-menu-item>
          </el-sub-menu>
        </template>

        <!-- 登出 -->
        <el-menu-item index="logout">
          <Close />
          <template #title>登出</template>
        </el-menu-item>
      </el-menu>
    </el-aside>

    <!-- 主內容區 -->
    <el-container class="main">
      <router-view></router-view>
    </el-container>
  </el-container>
</template>

<script setup>
import { useRouter } from "vue-router";
import { use_auth_store } from "./stores";
import { onMounted } from "vue";

const router = useRouter();
const auth_store = use_auth_store();

function handle_select(index) {
  if (index === "logout") {
    auth_store.logout();
  } else {
    // 跳轉到對應路由
    router.push(index);
  }
}

onMounted(async () => {
  const res = await auth_store.check_login();

  if (res == 401) {
    router.push("/");
  }
});
</script>

<style lang="scss" scoped>
@import "./assets/colors.scss";
@import "./assets/base.scss";
.aside {
  background-color: $gray;
}

.who {
  user-select: none;
  margin-left: 10px;
  font-weight: 900;
  .role {
    color: $red;
  }
}

.main {
  min-width: 600px;
  overflow-y: auto;
}

.el-menu-item,
.el-sub-menu__title span {
  font-weight: 900;
}

.el-menu-item svg,
.el-sub-menu__title svg {
  width: 20px;
  height: 20px;
  vertical-align: middle;
  margin: 0 10px;
}
</style>
