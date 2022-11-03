<template>
  <div>
    <el-card>
      <!-- 三级联动组件已经是全局组件了 -->
      <CategorySelect :show="scene !== 0" @getCategoryId="getCategoryId"></CategorySelect>
    </el-card>
    <el-card style="margin-top: 20px">
      <!-- 底部这里有三部分进行切换 -->
      <div v-show="scene === 0">
        <!-- 展示spu列表的结构 -->
        <el-button type="primary" icon="el-icon-plus" :disabled="!category3Id" @click="addSpu">添加SPU</el-button>
        <el-table style="width: 100%; margin-top: 10px" border :data="records">
          <el-table-column type="index" label="序号" width="80" align="center"> </el-table-column>
          <el-table-column prop="spuName" label="SPU名称" width="width"> </el-table-column>
          <el-table-column prop="description" label="SPU描述" width="width"> </el-table-column>
          <el-table-column prop="prop" label="操作" width="width">
            <template v-slot="{ row }">
              <!-- 这里的按钮将来用自己封装的 hintButton 替换 -->
              <hint-button type="success" icon="el-icon-plus" size="mini" title="添加sku" @click="addSku(row)"></hint-button>
              <hint-button type="warning" icon="el-icon-edit" size="mini" title="修改spu" @click="updateSpu(row)"></hint-button>
              <hint-button type="info" icon="el-icon-info" size="mini" title="查看当前spu的sku列表" @click="handler(row)"></hint-button>
              <el-popconfirm title="这是一段内容确定删除吗？" @onConfirm="deleteSpu(row)">
                <hint-button slot="reference" type="danger" icon="el-icon-delete" size="mini" title="删除spu"></hint-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination :current-page="page" :page-sizes="[3, 5, 10]" :page-size="limit" layout="prev, pager, next, jumper,->, sizes,total " :total="total" align="center" @current-change="getSpuList" @size-change="handleSizeChange"> </el-pagination>
      </div>
      <SpuForm v-show="scene === 1" ref="spu" @changeScene="changeScene"></SpuForm>
      <SkuForm v-show="scene === 2" ref="sku" @changeScenes="changeScenes"></SkuForm>
    </el-card>
    <!-- dialog弹框 -->
    <el-dialog :title="`${spu.spuName}的sku列表`" :visible.sync="dialogTableVisible" @close="close">
      <el-table v-loading="loading" :data="skuList" style="width: 100%">
        <el-table-column prop="skuName" label="名称" width="width"> </el-table-column>
        <el-table-column prop="price" label="价值" width="width"> </el-table-column>
        <el-table-column prop="weight" label="重量" width="width"> </el-table-column>
        <el-table-column prop="prop" label="默认图片" width="width">
          <template v-slot="{ row }">
            <img :src="row.skuDefaultImg" alt="" style="width: 80px; height: 80px" />
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import SpuForm from '@/views/product/Spu/SpuForm'
import SkuForm from '@/views/product/Spu/SkuForm'
export default {
  name: 'Spu',
  components: {
    SpuForm,
    SkuForm
  },
  data() {
    return {
      // 分别是分类的id
      category1Id: '',
      category2Id: '',
      category3Id: '',
      page: 1, // 分页器当前第几页
      limit: 3, // 每一页需要展示多少条数据
      records: [], // spu列表的数据
      total: 0, // 分页器一共需要展示数据的条数
      scene: 0, // 0：展示SPU列表数据    1：添加SPU|修改SPU    2：添加SKU
      // 控制dailog对话框的显示与隐藏
      dialogTableVisible: false,
      spu: {},
      // 存储sku列表的数据
      skuList: [],
      // 控制loading的显示与隐藏
      loading: true
    }
  },
  methods: {
    // 三级联动的自定义事件，可以把子组件响应的id传递给父组件
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
        // 发请求获取SPU列表数据进行展示
        this.getSpuList()
      }
    },
    // 获取Spu列表数据的方法
    async getSpuList(pages = 1) {
      this.page = pages
      const { page, limit, category3Id } = this
      // 携带三个参数：page：第几页    limit：每一页需要展示多少条数据     category3Id：三级分类的id
      const res = await this.$API.spu.reqSpuList(page, limit, category3Id)
      if (res.code === 200) {
        this.total = res.data.total
        this.records = res.data.records
      }
    },
    // 分页器展示数据条数发生变化的回调
    handleSizeChange(limit) {
      // 修改数据
      this.limit = limit
      // 再发请求
      this.getSpuList()
    },
    // 添加spu按钮的回调
    addSpu() {
      this.scene = 1
      // 通知子组件SpuForm发请求---两个
      this.$refs.spu.addSpuData(this.category3Id)
    },
    // 修改spu按钮的回调
    updateSpu(row) {
      this.scene = 1
      this.$refs.spu.initSpuData(row)
    },
    // 自定义事件的回调（SpuForm）
    changeScene({ scene, flag }) {
      // 切换场景
      this.scene = scene
      // 子组件通知本父组件切换场景，需要再次获取spu列表的数据进行展示
      if (flag === '修改') {
        // 修改则停留在分页器当前页
        this.getSpuList(this.page)
      } else {
        // 添加则回到第一页
        this.getSpuList()
      }
    },
    // 删除spu的回调
    async deleteSpu(row) {
      const res = await this.$API.spu.reqDeleteSpu(row.id)
      if (res.code === 200) {
        this.$message.success('删除成功！')
        // 重新获取数据进行展示
        // 删除之前当前页中SPU个数大于1停留在当前页，如果SPU个数等于1 回到上一页
        this.getSpuList(this.records.length > 1 ? this.page : this.page - 1)
      } else {
        this.$message.error('删除失败！')
      }
    },
    // 添加sku按钮的回调
    addSku(row) {
      // 切换场景为2
      this.scene = 2
      // 父组件调用子组件的方法，让子组件发请求---三个请求
      this.$refs.sku.getData(this.category1Id, this.category2Id, row)
    },
    // 自定义事件的回调（SkuForm）
    changeScenes(scene) {
      this.scene = scene
    },
    // 查看spu的sku列表的回调
    async handler(spu) {
      // 点击这个按钮，对话框可见
      this.dialogTableVisible = true
      // 保存spu信息
      this.spu = spu
      // 获取sku列表的信息进行展示
      const res = await this.$API.spu.reqSkuList(spu.id)
      if (res.code === 200) {
        this.skuList = res.data
        // 隐藏loading
        this.loading = false
      }
    },
    // 关闭dialog对话框的回调
    close() {
      // loading属性再次变为true,否则loading一直为false，下一次将不会再显示loading效果
      this.loading = true
      // 清除sku列表的数据，否则再次展示新的数据之前，上一次的数据将会进行回显
      this.skuList = []
    }
  }
}
</script>

<style></style>
