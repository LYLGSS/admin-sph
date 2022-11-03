<template>
  <!-- 这里根标签不用div是因为div会独自占一行 -->
  <a :title="title" style="margin: 10px 10px 10px 0px">
    <!--
      父组件传递过来的属性若没有用 props 接收，则保存在 $attr 中，传递过来的方法保存在 $listeners 中
      注意：v-bind 不可以简写为冒号 :
            v-on 不可以简写为 @
     -->
    <el-button v-bind="$attrs" v-on="$listeners"></el-button>
  </a>
</template>

<script>
export default {
  name: 'HintButton',
  props: {
    title: {
      type: String,
      default: ''
    }
  }
}
</script>

<style scoped></style>
