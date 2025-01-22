<template>
  <div class="page">
    <div class="logo">
      家家家具
      <img src="/base/Icon.png" />
      後臺管理
    </div>

    <div class="text">歡迎登入</div>
    <div class="text">
      <span class="role">{{ auth_store.admin.role_name }}</span>
      {{ auth_store.admin.name }}
    </div>

    <div class="time-display">
      {{ current_time }}
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import { use_auth_store } from "../stores/index";

const auth_store = use_auth_store();
const current_time = ref("");

// 更新時間函數
const update_time = () => {
  const now = new Date();
  current_time.value = now.toLocaleTimeString(); // 格式化時間
};

// 組件掛載時啟動定時器
let timer = null;
onMounted(() => {
  update_time();
  timer = setInterval(update_time, 1000);
});

// 組件卸載時清除定時器
onBeforeUnmount(() => {
  if (timer) {
    clearInterval(timer);
  }
});
</script>

<style lang="scss" scoped>
@import "../assets/colors.scss";
.page {
  user-select: none;
}
.logo {
  height: 300px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 900;
  font-size: 2rem;
  img {
    width: 300px;
    height: 300px;
  }
}

.text {
  font-weight: 900;
  font-size: 2rem;
  margin-bottom: 20px;
}
.role {
  color: $red;
}
</style>
