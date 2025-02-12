<template>
  <div class="container">
    <div class="bg"></div>
    <div class="shade"></div>

    <div class="login_container">
      <div>
        <div class="logo">
          <span>家家家具</span>
          <img src="/base/Icon.png" />
          <span>後台管理</span>
        </div>

        <el-input
          v-model="admin_id"
          style="width: 300px; height: 40px"
          placeholder="請輸入使用者ID"
          maxlength="15"
        />
      </div>
      <div>
        <el-input
          v-model="password"
          style="width: 300px; height: 40px"
          type="password"
          placeholder="請輸入密碼"
          show-password
          maxlength="15"
        />
      </div>
      <el-button type="primary" round @click="login">登入</el-button>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { use_auth_store } from "../stores/index";
import { useRouter } from "vue-router";

const auth_store = use_auth_store();
const router = useRouter();

const admin_id = ref("");

const password = ref("");

async function login() {
  try {
    const isNext = await auth_store.login(admin_id.value, password.value);
    if (isNext) {
      router.push("home");
    } else {
      password.value = "";
    }
  } catch (error) {
    console.error("登入出現錯誤!", error);
  }
}
</script>

<style lang="scss" scoped>
@import "../assets/colors.scss";

.container {
  width: 100%;
  display: flex;
  position: relative;

  .bg {
    position: absolute;
    width: 100%;
    height: 100%;
    background-image: url(/base/loginBG.jpg);
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
    filter: blur(2px);
  }
  .shade {
    width: 100%;
    height: 100%;
    background-color: $black4;
    position: absolute;
  }
}

.login_container {
  z-index: 5;
  display: flex;
  flex-direction: column;
  margin: auto;
  gap: 30px;
  padding: 60px;
  border: 1px solid $white;
  box-shadow: 0 4px 10px $black8;
  border-radius: 5%;
  backdrop-filter: blur(10px);
  .logo {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: -60px auto auto auto;
    color: $gray;
    font-size: 1.5rem;
    font-weight: 900;
    img {
      width: 100px;
    }
  }
}
</style>
