<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App',
  // 每次刷新页面时，回到首页，否则出现空白页
  created() {
    if (this.$route.path === '/') {
      this.$router.replace('/dashboard')
    }
  }
}
</script>
