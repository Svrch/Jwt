<script setup>
import { useAuthStore } from './stores/auth';

const authStore = useAuthStore()

const checkUser = () => {
  const tokens = JSON.parse(localStorage.getItem('userTokens'))
  if (tokens) {
    authStore.userInfo.token = tokens.token
    authStore.userInfo.refreshToken = tokens.refreshToken
    authStore.userInfo.expiresIn = tokens.expiresIn
  }
  console.log(authStore.userInfo);
}
checkUser()
</script>

<template>
  <div class="container">
    <RouterView />
  </div>
</template>

<style>
.container {
  max-width: 700px;
  margin: auto;
  font-family: Arial, sans-serif;
}
</style>
