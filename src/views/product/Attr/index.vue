<template>
  <div>
    <el-card>
      <CategorySelect :show="!isShowTable" @getCategoryId="getCategoryId"></CategorySelect>
    </el-card>
    <el-card style="margin-top: 20px">
      <div v-show="isShowTable">
        <el-button type="primary" icon="el-icon-plus" style="margin-bottom: 10px" :disabled="!category3Id" @click="addAttr">添加属性</el-button>
        <!-- 表格：展示平台属性 -->
        <el-table style="width: 100%" border :data="attrList">
          <el-table-column type="index" label="序号" width="80" align="center"> </el-table-column>
          <el-table-column prop="attrName" label="属性名称" width="150"> </el-table-column>
          <el-table-column prop="prop" label="属性值列表" width="width">
            <template v-slot="{ row }">
              <el-tag v-for="(attrValue, index) in row.attrValueList" :key="attrValue.id" type="success" :style="{ 'margin-left': index > 0 ? '15px' : '0px' }">{{ attrValue.valueName }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="150">
            <template v-slot="{ row }">
              <el-button type="warning" icon="el-icon-edit" size="mini" @click="updateAttr(row)"></el-button>
              <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div v-show="!isShowTable">
        <el-form ref="form" :inline="true" label-width="54px" :model="attrInfo">
          <el-form-item label="属性名">
            <el-input v-model="attrInfo.attrName" placeholder="请输入属性名"></el-input>
          </el-form-item>
        </el-form>
        <el-button type="primary" icon="el-icon-plus" :disabled="!attrInfo.attrName" @click="addAttrValue">添加属性值</el-button>
        <el-button @click="isShowTable = true">取消</el-button>
        <el-table style="width: 100%; margin: 20px 0" border :data="attrInfo.attrValueList">
          <el-table-column type="index" align="center" label="序号" width="80"> </el-table-column>
          <el-table-column prop="prop" label="属性值名称" width="width">
            <template v-slot="{ row, $index }">
              <el-input v-if="row.flag" :ref="$index" v-model="row.valueName" placeholder="请输入属性值名称" size="mini" @blur="toLook(row)" @keyup.native.enter="row.flag = false"></el-input>
              <span v-else style="display: block" @click="toEdit(row, $index)">{{ row.valueName }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="width">
            <template v-slot="{ row, $index }">
              <!-- 气泡确认框 -->
              <el-popconfirm :title="`确定删除${row.valueName}？`" @onConfirm="deleteAttrValue($index)">
                <el-button slot="reference" type="danger" icon="el-icon-delete" size="mini"></el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <el-button type="primary" :disabled="attrInfo.attrValueList.length < 1" @click="addOrUpdateAttr">保存</el-button>
        <el-button @click="isShowTable = true">取消</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
// 按需引入lodash当中的深拷贝
import { cloneDeep } from 'lodash'
export default {
  name: 'Attr',
  data() {
    return {
      category1Id: '',
      category2Id: '',
      category3Id: '',
      // 接收平台属性
      attrList: [],
      // 控制table表格显示与隐藏
      isShowTable: true,
      // 收集新增属性|修改属性使用的
      attrInfo: {
        attrName: '', // 属性名
        attrValueList: [
          // 属性值，因为属性值可以有多个因此用数组，每一个属性值都是一个对象需要attrId，valueName
        ],
        categoryId: 0, // 三级分类的id
        categoryLevel: 3 // 因为服务器也需要区分几级id
      }
    }
  },
  methods: {
    // 自定义事件的回调函数
    getCategoryId({ categoryId, level }) {
      // 区分三级分类id，以及父组件存储id
      if (level === 1) {
        this.category1Id = categoryId
        this.category2Id = ''
        this.category3Id = ''
      } else if (level === 2) {
        this.category2Id = categoryId
        this.category3Id = ''
      } else {
        // 代表三级分类的id有了（一级二级肯定也有）
        this.category3Id = categoryId
        // 发请求获取品牌属性
        this.getAttrList()
      }
    },
    // 获取品牌属性的数据
    // 当用户确定三级分类的数据时，可以向服务器发请求获取品牌属性进行展示
    async getAttrList() {
      // 解构出三级分类的id
      const { category1Id, category2Id, category3Id } = this
      const res = await this.$API.attr.reqAttrList(category1Id, category2Id, category3Id)
      this.attrList = res.data
    },
    // 添加属性值回调
    addAttrValue() {
      // 向属性值的数组里面添加元素
      // attrId：是你相应的属性的id，目前而言我们是添加属性的操作，还没有相应的属性的id，目前而言带给服务器的id为undefined
      // valueName:相应的属性值的名称
      this.attrInfo.attrValueList.push({
        attrId: this.attrInfo.id, // 对于修改某一个属性的时候，可以在已有的属性值基础之上新增新的属性值（新增属性值的时候，需要把已有的属性的id带上）
        valueName: '',
        flag: true // flag属性：给每一个属性值添加一个标记flag，用户切换查看模式与编辑模式，好处，每一个属性值可以控制自己的模式切换
      })
      // 添加的输入框自动聚焦
      this.$nextTick(() => {
        this.$refs[this.attrInfo.attrValueList.length - 1].focus()
      })
    },
    // 添加属性按钮的回调
    addAttr() {
      // 切换table标签显示与隐藏
      this.isShowTable = false
      // 清除数据，并收集三级分类的id
      this.attrInfo = {
        attrName: '', // 属性名
        attrValueList: [
          // 属性值，因为属性值可以有多个因此用数组，每一个属性值都是一个对象需要attrId，valueName
        ],
        categoryId: this.category3Id, // 三级分类的id
        categoryLevel: 3 // 因为服务器也需要区分几级id
      }
    },
    // 修改某一个属性
    updateAttr(row) {
      this.isShowTable = false
      this.attrInfo = cloneDeep(row)
      // this.attrInfo = JSON.parse(JSON.stringify(row))  //这种方法也可以实现深拷贝，但是若拷贝的对象中存在函数，则会丢失

      this.attrInfo.attrValueList.forEach(item => {
        // 这样书写也可以给属性值添加flag自动，但是会发现视图不会跟着变化（因为flag不是响应式数据）
        // item.flag = false
        // 因为Vue无法探测普通的新增 property,这样书写的属性并非响应式属性（数据变化视图跟这边）
        // 第一个参数:对象  第二个参数:添加新的响应式属性  第三参数：新的属性的属性值
        this.$set(item, 'flag', false)
      })
    },
    // 失却焦点的事件---切换为查看模式，展示span
    toLook(row) {
      // 如果属性值为空不能作为新的属性值，需要给用户提示，让他输入一个其他的属性值
      if (row.valueName.trim() === '') {
        return this.$message.warning('请输入一个正常的属性值！')
      }
      // 新增的属性值不能与已有的属性值重复
      const isRepeat = this.attrInfo.attrValueList.some(item => {
        // 需要将row从数组里面判断的时候去除
        // row最新新增的属性值【数组的最后一项元素】
        // 判断的时候，需要把已有的数组当中新增的这个属性值去除
        if (item !== row) {
          return row.valueName === item.valueName
        }
      })
      if (isRepeat) return this.$message.warning('不可添加重复的属性值！')
      // row：形参是当前用户添加的最新的属性值
      // 当前编辑模式变为查看模式【让input消失，显示span】
      row.flag = false
    },
    // 点击span的回调，变为编辑模式
    toEdit(row, index) {
      row.flag = true
      this.$nextTick(() => {
        this.$refs[index].focus()
      })
    },
    // 气泡确认框确认按钮的回调
    deleteAttrValue(index) {
      this.attrInfo.attrValueList.splice(index, 1)
    },
    // 保存按钮：进行添加属性或修改属性的操作
    async addOrUpdateAttr() {
      // 整理参数：如果用户添加很多属性，且属性值为空，则不应该提交给服务器
      // 提交给服务器数据中不应该出现flag字段
      this.attrInfo.attrValueList = this.attrInfo.attrValueList.filter(item => {
        // 过滤掉属性值为空的，留下属性值不为空的
        if (item.valueName !== '') {
          // 删除flag属性
          delete item.flag
          return true
        }
      })
      try {
        // 发请求
        await this.$API.attr.reqAddOrUpdateAttr(this.attrInfo)
        // 显示展示商品数据的表格
        this.isShowTable = true
        this.$message.success('保存成功！')
        // 保存成功后需要再次获取平台属性进行展示
        this.getAttrList()
      } catch (error) {
        this.$message.error('保存失败!')
      }
    }
  }
}
</script>

<style></style>
