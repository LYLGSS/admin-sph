<template>
  <div>
    <el-button v-show="$store.state.user.buttons.includes('btn.Add1')" type="primary">添加按钮1</el-button>
    <el-button v-show="$store.state.user.buttons.includes('btn.Add2')" type="primary">添加按钮2</el-button>
  </div>
</template>

<script>
export default {}
</script>

<style></style>
