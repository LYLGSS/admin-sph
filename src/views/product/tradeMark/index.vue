<template>
  <div>
    <!-- 添加按钮 -->
    <el-button type="primary" icon="el-icon-plus" style="margin-bottom: 10px" @click="showDialog">添加</el-button>
    <!--
      表格组件：
        data:表格组件需要展示的数据---数组类型
        border:给表格添加边框
        column属性：
          label:显示标题
          width:对应列的宽
          align：标题的对齐方式
     -->
    <el-table style="width: 100%" border :data="list">
      <el-table-column type="index" label="序号" width="80px" align="center"> </el-table-column>
      <el-table-column prop="tmName" label="品牌名称" width="width"> </el-table-column>
      <el-table-column label="品牌LOGO" width="width">
        <template v-slot="{ row }">
          <img :src="row.logoUrl" alt="" style="width: 70px; height: 70px" />
        </template>
      </el-table-column>
      <el-table-column prop="prop" label="操作" width="width">
        <template v-slot="{ row }">
          <el-button type="warning" size="mini" icon="el-icon-edit" @click="updateTradeMark(row)">修改</el-button>
          <el-button type="danger" size="mini" icon="el-icon-delete" @click="deleteTradeMark(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--
      分页器
        当前第几页、数据总条数、每一页展示条数、连续页码数
        current-page:代表的是当前第几页
        total:分页器一共需要展示多少条数据
        page-size:每一页需要展示多少条数据
        page-sizes:可以设置每一页展示多少条数据
        layout:可以实现分页器布局
        pager-count:按钮的数量
    -->
    <el-pagination style="margin-top: 20px; text-align: center" :current-page="page" :total="total" :page-size="3" :page-sizes="[3, 5, 10]" :pager-count="7" layout=" prev, pager, next, jumper,->, sizes, total" @current-change="getPageList" @size-change="handleSizeChange"> </el-pagination>

    <!-- dialog对话框 -->
    <el-dialog :title="tmForm.id ? '修改品牌' : '添加品牌'" :visible.sync="dialogFormVisible">
      <!-- form表单:model属性，这个属性的作用是把表单的数据收集到那个对象的身上，将来表单验证也需要这个数据 -->
      <el-form ref="ruleForm" style="width: 80%" :model="tmForm" :rules="rules">
        <!-- 添加品牌名称 -->
        <el-form-item label="品牌名称" label-width="100px" prop="tmName">
          <el-input v-model="tmForm.tmName" autocomplete="off"></el-input>
        </el-form-item>
        <!-- 添加品牌LOGO -->
        <el-form-item label="品牌LOGO" label-width="100px" prop="logoUrl">
          <!-- 上传图片的组件 -->
          <!-- 这里收集数据：不能使用v-model，因为不是表单元素，action:设置图片上传的地址-->
          <el-upload class="avatar-uploader" action="/dev-api/admin/product/fileUpload" :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
            <img v-if="imageUrl" :src="imageUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <div slot="tip" class="el-upload__tip">只能上传jpg文件，且不超过2MB</div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addOrUpdateTradeMark">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'TradeMark',
  data() {
    return {
      // 分页器第几页
      page: 1,
      // 当前页数展示数据条数
      limit: 3,
      // 总共数据条数
      total: 0,
      // 列表展示的数据
      list: [],
      // 控制对话框显示与隐藏
      dialogFormVisible: false,
      // 上传图片使用的属性
      imageUrl: '',
      // 收集品牌信息
      tmForm: {
        tmName: '',
        logoUrl: ''
      },
      // 表单验证规则
      rules: {
        // 品牌名称的校验规则
        tmName: [
          { required: true, message: '请输入品牌名称', trigger: 'blur' },
          { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'change' }
        ],
        // 品牌logo的验证规则
        logoUrl: [{ required: true, message: '请选择品牌的图片' }]
      }
    }
  },
  // 组件挂载完毕发请求
  mounted() {
    // 获取列表数据的方法
    this.getPageList()
  },
  methods: {
    async getPageList(pager = 1) {
      this.page = pager
      // 解构出参数
      const { page, limit } = this
      // 获取品牌列表的接口
      // 当你向服务器发请求的时候，这个函数需要带参数，因此在data当中初始化两个字段，代表给服务器传递参数
      const res = await this.$API.trademark.reqTradeMarkList(page, limit)
      if (res.code === 200) {
        // 展示数据总条数
        this.total = res.data.total
        // 列表展示的数据
        this.list = res.data.records
      }
    },
    handleSizeChange(limit) {
      this.limit = limit
      this.getPageList()
    },
    // 点击添加品牌的按钮
    showDialog() {
      // 显示对话框
      this.dialogFormVisible = true
      // 清除数据
      this.tmForm = { tmName: '', logoUrl: '' }
      this.imageUrl = ''
    },
    // 点击修改的按钮
    updateTradeMark(row) {
      // row:当前用户选中的品牌信息
      // 显示对话框
      this.dialogFormVisible = true
      // 将已有品牌信息赋值给tmForm进行展示
      this.tmForm = { ...row } // 对象直接赋值的是地址的引用，修改tmForm的值row也会改变，由于row的值在页面中进行展示，所以不能修改row的值，需要进行浅拷贝
      this.imageUrl = this.tmForm.logoUrl
    },
    // 上传图片相关的回调
    // 图片上传成功
    handleAvatarSuccess(res, file) {
      // 这里使用imageUrl为了在页面展示上传的图片（由于图片不显示，所以使用此方法，网课中没有使用此方法）
      this.imageUrl = URL.createObjectURL(file.raw)
      this.tmForm.logoUrl = res.data
    },
    // 图片上传之前
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },
    // 确定按钮（添加品牌 | 修改品牌）
    addOrUpdateTradeMark() {
      // 全部验证规则通过，再进行相关业务逻辑
      this.$refs.ruleForm.validate(async success => {
        // 如果全部字段符合条件
        if (success) {
          this.dialogFormVisible = false
          // 发请求（添加品牌 | 修改品牌）
          const res = await this.$API.trademark.reqAddOrUpdateTradeMark(this.tmForm)
          if (res.code === 200) {
            // 弹出信息：添加品牌成功 | 修改品牌成功
            this.$message.success(this.tmForm.id ? '修改品牌成功！' : '添加品牌成功！')
            // 添加或修改品牌成功后，需要再次获取品牌列表数据进行展示
            // 如果添加品牌,停留在第一页,修改品牌则停留在当前页
            this.getPageList(this.tmForm.id ? this.page : 1)
          }
          this.imageUrl = ''
        }
      })
    },
    // 删除品牌
    deleteTradeMark(row) {
      // 弹框
      this.$confirm(`确定删除${row.tmName}？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        // 用户点击确定按钮
        .then(async () => {
          // 向服务器发请求
          const res = await this.$API.trademark.reqDeleteTradeMark(row.id)
          // 如果删除成功
          if (res.code === 200) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
          }
          // 再次获取品牌列表数据
          this.getPageList(this.list.length > 1 ? this.page : this.page - 1)
        })
        // 用户点击取消按钮
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    }
  }
}
</script>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
