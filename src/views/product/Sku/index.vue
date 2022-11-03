<template>
  <div>
    <!-- 表格 -->
    <el-table style="width: 100%" border :data="records">
      <el-table-column type="index" label="序号" width="80" align="center"> </el-table-column>
      <el-table-column prop="skuName" label="名称" width="width"> </el-table-column>
      <el-table-column prop="skuDesc" label="描述" width="width"> </el-table-column>
      <el-table-column prop="prop" label="默认图片" width="110">
        <template v-slot="{ row }">
          <img :src="row.skuDefaultImg" alt="" style="width: 80px; height: 80px" />
        </template>
      </el-table-column>
      <el-table-column prop="weight" label="重量" width="80"> </el-table-column>
      <el-table-column prop="price" label="价格" width="80"> </el-table-column>
      <el-table-column prop="prop" label="操作" width="width">
        <template v-slot="{ row }">
          <el-button v-if="row.isSale === 1" type="success" icon="el-icon-top" size="mini" @click="cancel(row)"></el-button>
          <el-button v-else type="info" icon="el-icon-bottom" size="mini" @click="sale(row)"></el-button>
          <el-button type="primary" icon="el-icon-edit" size="mini" @click="edit"></el-button>
          <el-button type="info" icon="el-icon-info" size="mini" @click="getSkuInfo(row)"></el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器 -->
    <el-pagination style="text-align: center" :current-page="page" :page-sizes="[3, 5, 10]" :page-size="limit" layout=" prev, pager, next, jumper, ->,sizes, total" :total="total" @current-change="getSkuList" @size-change="handleSizeChange"> </el-pagination>
    <!-- 抽屉效果 -->
    <el-drawer :visible.sync="show" :show-close="false" size="50%">
      <el-row>
        <el-col :span="5">名称</el-col>
        <el-col :span="16">{{ skuInfo.skuName }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">描述</el-col>
        <el-col :span="16">{{ skuInfo.skuDesc }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">价格</el-col>
        <el-col :span="16">{{ skuInfo.price + '元' }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">平台属性</el-col>
        <el-col :span="16">
          <el-tag v-for="attr in skuInfo.skuAttrValueList" :key="attr.id" type="success" style="margin-right: 10px">{{ attr.attrId }}-{{ attr.valueId }}</el-tag>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="5">商品图片</el-col>
        <el-col :span="16">
          <el-carousel height="400px" style="width: 400px; border: 1px solid rgb(255, 133, 133)">
            <el-carousel-item v-for="item in skuInfo.skuImageList" :key="item.id">
              <img :src="item.imgUrl" style="width: 400px; height: auto" />
            </el-carousel-item>
          </el-carousel>
        </el-col>
      </el-row>
    </el-drawer>
  </div>
</template>

<script>
export default {
  name: 'Sku',
  data() {
    return {
      page: 1, // 当前第几页
      limit: 10, // 当前页面有几条数据
      records: [], // 存储sku列表的数据
      total: 0, // 存储分页器一共展示的数据条数
      skuInfo: {}, // 存储sku信息
      show: false // 抽屉的显示与隐藏
    }
  },
  mounted() {
    // 获取sku列表的数据
    this.getSkuList()
  },
  methods: {
    // 获取sku列表的数据
    async getSkuList(pages = 1) {
      this.page = pages
      const res = await this.$API.sku.reqSkuList(this.page, this.limit)
      if (res.code === 200) {
        this.total = res.data.total
        this.records = res.data.records
      }
    },
    // 分页器每一页展示数据条数改变的回调函数
    handleSizeChange(limit) {
      // 修改参数
      this.limit = limit
      // 再次获取数据
      this.getSkuList()
    },
    // 上架
    async sale(row) {
      const res = await this.$API.sku.reqSale(row.id)
      if (res.code === 200) {
        row.isSale = 1
        this.$message.success('上架成功！')
      }
    },
    // 下架
    async cancel(row) {
      const res = await this.$API.sku.reqCancel(row.id)
      if (res.code === 200) {
        row.isSale = 0
        this.$message.success('下架成功！')
      }
    },
    edit() {
      this.$message('正在开发中……')
    },
    // 获取sku详情的方法
    async getSkuInfo(sku) {
      // 展示抽屉
      this.show = true
      const res = await this.$API.sku.reqSkuById(sku.id)
      if (res.code === 200) {
        this.skuInfo = res.data
      }
    }
  }
}
</script>

// 轮播图的样式
<style>
.el-carousel__item h3 {
  color: #475669;
  font-size: 14px;
  opacity: 0.75;
  line-height: 150px;
  margin: 0;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}
</style>

<style lang="scss" scoped>
.el-row .el-col-5 {
  font-size: 18px;
  text-align: right;
}
.el-col {
  margin: 10px 10px;
}
::v-deep .el-carousel__button {
  width: 10px;
  height: 10px;
  background: red;
  border-radius: 50%;
}
</style>
