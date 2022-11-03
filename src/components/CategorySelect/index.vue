<template>
  <div>
    <!-- inline:代表的是行内表单，代表一行可以放置多个表单元素 -->
    <el-form :inline="true" class="demo-form-inline" :model="cForm" :disabled="show">
      <el-form-item label="一级分类">
        <el-select v-model="cForm.category1Id" placeholder="请选择" @change="handler1($event)">
          <el-option v-for="c1 in list1" :key="c1.id" :label="c1.name" :value="c1.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="二级分类">
        <el-select v-model="cForm.category2Id" placeholder="请选择" @change="handler2($event)">
          <el-option v-for="c2 in list2" :key="c2.id" :label="c2.name" :value="c2.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="三级分类">
        <el-select v-model="cForm.category3Id" placeholder="请选择" @change="handler3($event)">
          <el-option v-for="c3 in list3" :key="c3.id" :label="c3.name" :value="c3.id"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'CategorySelect',
  props: {
    show: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      // 一级分类的数据
      list1: [],
      // 二级分类的数据
      list2: [],
      // 三级分类的数据
      list3: [],
      // 收集一级二级三级分类的id
      cForm: {
        category1Id: '',
        category2Id: '',
        category3Id: ''
      }
    }
  },
  mounted() {
    // 获取一级分类的数据
    this.getCategory1List()
  },
  methods: {
    // 获取一级分类的数据的方法
    async getCategory1List() {
      const res = await this.$API.attr.reqCategory1List()
      if (res.code === 200) {
        this.list1 = res.data
      }
    },
    // 一级分类的select事件回调（当一级分类的option发生变化的时候获取相应二级分类的数据）
    async handler1(category1Id) {
      // 清除二级分类和三级分类的数据
      this.list2 = []
      this.list3 = []
      this.cForm.category2Id = ''
      this.cForm.category3Id = ''
      // 触发自定义事件，向父组件传递一级分类的id
      this.$emit('getCategoryId', { categoryId: category1Id, level: 1 })
      // 通过一级分类的id，获取二级分类的数据
      const res = await this.$API.attr.reqCategory2List(category1Id)
      if (res.code === 200) {
        this.list2 = res.data
      }
    },
    // 二级分类的select事件回调（当二级分类的option发生变化的时候获取相应三级分类的数据）
    async handler2(category2Id) {
      // 清除三级分类的数据
      this.list3 = []
      this.cForm.category3Id = ''
      // 触发自定义事件，向父组件传递一级分类的id
      this.$emit('getCategoryId', { categoryId: category2Id, level: 2 })
      // 通过二级分类的id，获取三级分类的数据
      const res = await this.$API.attr.reqCategory2List(category2Id)
      if (res.code === 200) {
        this.list3 = res.data
      }
    },
    // 三级分类事件的回调
    handler3(category3Id) {
      // 触发自定义事件，向父组件传递一级分类的id
      this.$emit('getCategoryId', { categoryId: category3Id, level: 3 })
    }
  }
}
</script>

<style></style>
