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
          <div class="position">{{ auth_store.admin.role_name }}</div>
          <div>{{ auth_store.admin.name }}</div>
        </div>
        <el-menu-item v-if="auth_store.isAdmin" index="/permissions">
          <Stamp />
          <template #title>權限控制</template>
        </el-menu-item>
        <el-menu-item index="/users">
          <User />
          <template #title>會員操作</template>
        </el-menu-item>
        <el-menu-item index="/products">
          <Box />
          <template #title>商品操作</template>
        </el-menu-item>
        <el-sub-menu v-if="auth_store.isAdmin" index="data">
          <template #title>
            <Histogram />
            <span>數據一覽</span>
          </template>
          <el-menu-item index="data_sales">
            <Crop /> <template #title>銷量/庫存</template></el-menu-item
          >
          <el-menu-item index="data_revenue"
            ><DCaret /> <template #title>營業額</template></el-menu-item
          >
        </el-sub-menu>
        <el-menu-item @click="auth_store.logout()" index="logout">
          <Close />
          <template #title>登出</template>
        </el-menu-item>
      </el-menu>
    </el-aside>

    <!-- 主內容區 -->
    <el-container>
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
    console.log("執行登出操作");
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

.aside {
  background-color: $gray;
}

.who {
  user-select: none;
  margin-left: 10px;
  font-weight: 900;
  .position {
    color: $red;
  }
}

.el-main {
  padding: 20px;
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
