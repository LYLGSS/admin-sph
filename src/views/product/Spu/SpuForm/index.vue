<template>
  <div>
    <el-form ref="form" label-width="80px" :model="spu">
      <el-form-item label="SPU名称">
        <el-input v-model="spu.spuName" placeholder="SPU名称"></el-input>
      </el-form-item>
      <el-form-item label="品牌">
        <el-select v-model="spu.tmId" placeholder="请选择品牌">
          <el-option v-for="tm in tradeMarkList" :key="tm.id" :label="tm.tmName" :value="tm.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="SPU描述">
        <el-input v-model="spu.description" type="textarea" rows="4" placeholder="SPU描述"></el-input>
      </el-form-item>
      <el-form-item label="SPU图片">
        <!-- 上传图片：action图片上传的地址  list-type: 文件列表的类型 on-preview:图片预览的时候会出发  on-remove:当删除图片的时候会出发
         file-list：照片墙需要展示的数据【数组：数组里面的元素务必要有name、url属性】
         on-preview：图片预览功能
         on-remove：删除图片的时候会触发
        -->
        <el-upload action="/dev-api/admin/product/fileUpload" list-type="picture-card" :on-preview="handlePictureCardPreview" :on-remove="handleRemove" :on-success="handlerSuccess" :file-list="spuImageList">
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="" />
        </el-dialog>
      </el-form-item>
      <el-form-item label="销售属性">
        <el-select v-model="attrIdAndAttrName" :placeholder="`还有${unSelectSaleAttr.length}未选择`">
          <el-option v-for="unselect in unSelectSaleAttr" :key="unselect.id" :label="unselect.name" :value="`${unselect.id}:${unselect.name}`"></el-option>
        </el-select>
        <el-button type="primary" icon="el-icon-plus" style="margin-left: 10px" :disabled="!attrIdAndAttrName" @click="addSaleAttr">添加销售属性</el-button>
        <!-- 展示的是当前SPU属于自己的销售属性 -->
        <el-table style="width: 100%; margin-top: 10px" border :data="spu.spuSaleAttrList">
          <el-table-column type="index" label="序号" width="80" align="center"> </el-table-column>
          <el-table-column prop="saleAttrName" label="属性名" width="150"> </el-table-column>
          <el-table-column prop="prop" label="属性值名称列表" width="width">
            <template v-slot="{ row }">
              <el-tag v-for="(tag, index) in row.spuSaleAttrValueList" :key="tag.id" closable :disable-transitions="false" @close="row.spuSaleAttrValueList.splice(index, 1)">
                {{ tag.saleAttrValueName }}
              </el-tag>
              <el-input v-if="row.inputVisible" ref="saveTagInput" v-model="row.inputValue" class="input-new-tag" size="small" @blur="handleInputConfirm(row)" @keyup.enter.native="$event.target.blur"> </el-input>
              <!-- @click="showInput" -->
              <el-button v-else class="button-new-tag" size="small" icon="el-icon-plus" :disabled="btnDisabled" @click="addSaleAttrValue(row)">添加</el-button>
            </template>
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="250">
            <template v-slot="{ $index }">
              <el-button type="danger" size="mini" @click="spu.spuSaleAttrList.splice($index, 1)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="addOrUpdateSpu">保存</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'SpuForm',
  data() {
    return {
      dialogImageUrl: '',
      dialogVisible: false,
      // spu属性初始化的时候是一个空的对象,在修改SPU的时候，会想服务器发请求，返回SPU信息（对象），在修改的时候可以利用服务器返回的这个对象收集最新的数据提交给服务器
      // 但是添加SPU的时候并没有向服务器发请求，数据收集到哪里呀[SPU]，收集数据的时候有哪些字段呀，看文档，所以需要初始化某些字段，spu不能为空对象
      // 存储spu信息属性
      spu: {
        // 三级分类的id
        category3Id: 0,
        // 描述
        description: '',
        // spu名称
        spuName: '',
        // 平台的id
        tmId: '',
        // 收集SPU图片的信息
        spuImageList: [
          // {
          //   id: 0,
          //   imgName: "string",
          //   imgUrl: "string",
          //   spuId: 0,
          // },
        ],
        // 平台属性与属性值收集（将来要带给服务器的）
        spuSaleAttrList: [
          // {
          //   baseSaleAttrId: 0,
          //   id: 0,
          //   saleAttrName: "string",
          //   spuId: 0,
          //   spuSaleAttrValueList: [
          //     {
          //       baseSaleAttrId: 0,
          //       id: 0,
          //       isChecked: "string",
          //       saleAttrName: "string",
          //       saleAttrValueName: "string",
          //       spuId: 0,
          //     },
          //   ],
          // },
        ]
      },
      tradeMarkList: [], // 存储品牌数据
      spuImageList: [], // 存储spu图片数据
      saleAttrList: [], // 销售属性的数据（全部：一共三条）
      attrIdAndAttrName: '' // 收集未选择的销售属性的id和销售属性名
    }
  },
  computed: {
    // 计算出还未选择的销售属性
    unSelectSaleAttr() {
      // 整个平台的销售属性一共三个：尺寸、颜色、版本----saleAttrList
      // 当前spu拥有的属于自己的销售属性----spu.spuSaleAttrList
      return this.saleAttrList.filter(item => {
        return this.spu.spuSaleAttrList.every(item1 => {
          return item.name !== item1.saleAttrName
        })
      })
    },
    // 添加按钮是否禁用
    btnDisabled() {
      return this.spu.spuSaleAttrList.some(item => item.inputVisible)
    }
  },
  methods: {
    // 照片墙删除某一个图片的时候会触发
    handleRemove(file, fileList) {
      // file参数:代表的是删除的那个张图片
      // fileList:照片墙删除某一张图片以后，剩余的其他的图片
      // console.log(file, fileList, 22222)
      // 收集照片墙图片的数据
      // 对于已有的图片【照片墙中显示的图片：有name、url字段的】，因为照片墙显示数据务必要有这两个属性
      // 对于服务器而言，不需要name、url字段，将来对于有的图片的数据在提交给服务器的时候，需要处理的，因此先将fileList保存到其他地方
      this.spuImageList = fileList
    },
    // 照片墙图片预览的回调
    handlePictureCardPreview(file) {
      // 将图片地址赋值给这个属性
      this.dialogImageUrl = file.url
      // 对话框显示
      this.dialogVisible = true
    },
    // 照片墙图片上传成功的回调
    handlerSuccess(response, file, fileList) {
      // 收集图片的信息
      // console.log(response, file, fileList)
      this.spuImageList = fileList
    },
    // 初始化SpuForm数据
    async initSpuData(spu) {
      // 获取SPU信息的数据
      const spuRes = await this.$API.spu.reqSpu(spu.id)
      if (spuRes.code === 200) {
        this.spu = spuRes.data
      }
      // 获取品牌的信息
      const tradeMarkRes = await this.$API.spu.reqTradeMarkList()
      if (tradeMarkRes.code === 200) {
        this.tradeMarkList = tradeMarkRes.data
      }
      // 获取spu图片的数据
      const spuImageRes = await this.$API.spu.reqSpuImageList(spu.id)
      if (spuImageRes.code === 200) {
        // 注意：这里是将 spuImageRes.data 的引用地址赋值给 listArr，修改 listArr， spuImageRes.data也会变，其实就是修改 spuImageRes.data（listArr 可以省略）
        const listArr = spuImageRes.data
        // 由于照片墙显示图片的数据需要数组，数组里面的元素需要有name与url字段
        // 需要把服务器返回的数据进行修改(添加name与url字段)
        listArr.forEach(item => {
          item.name = item.imgName
          item.url = item.imgUrl
        })
        // 把整理好的数据赋值给
        this.spuImageList = listArr
      }

      // 获取平台销售属性的数据
      const saleRes = await this.$API.spu.reqBaseSaleAttrList()
      if (saleRes.code === 200) {
        this.saleAttrList = saleRes.data
      }
    },
    // 添加新的销售属性
    addSaleAttr() {
      // 已经收集需要添加的销售属性的信息
      // 把收集到的销售属性数据进行分割
      const [baseSaleAttrId, saleAttrName] = this.attrIdAndAttrName.split(':')
      // 向SPU对象的spuSaleAttrList属性里面添加新的销售属性
      const newSaleAttr = {
        baseSaleAttrId,
        saleAttrName,
        spuSaleAttrValueList: []
      }
      // 添加新的销售属性
      this.spu.spuSaleAttrList.push(newSaleAttr)
      // 清空数据
      this.attrIdAndAttrName = ''
    },
    // 添加按钮的回调
    addSaleAttrValue(row) {
      // 点击销售属性值当中添加按钮的时候，需要有button变为input,通过当前销售属性的inputVisible控制
      // 挂载在销售属性身上的响应式数据inputVisible，控制button与input切换
      this.$set(row, 'inputVisible', true)
      // 通过响应式数据inputValue字段收集新增的销售属性值
      this.$set(row, 'inputValue', '')
      this.$nextTick(() => {
        this.$refs.saveTagInput.focus()
      })
    },
    // el-input失却焦点的事件
    handleInputConfirm(row) {
      // 解构出销售属性当中收集到的数据
      const { baseSaleAttrId, inputValue } = row
      if (inputValue.trim() === '') {
        this.$refs.saveTagInput.focus()
        this.$message.warning('属性值不能为空！')
        return
      }
      // 属性值不能重复
      const result = row.spuSaleAttrValueList.some(item => item.saleAttrValueName === inputValue)
      if (result) {
        this.$refs.saveTagInput.focus()
        this.$message.warning('属性值不能重复！')
        return
      }
      // 新增的销售属性值
      const newSaleAttrValue = {
        baseSaleAttrId,
        saleAttrValueName: inputValue
      }
      // 新增
      row.spuSaleAttrValueList.push(newSaleAttrValue)
      // 修改inputVisible为false，显示button
      row.inputVisible = false
    },
    // 保存按钮的回调
    async addOrUpdateSpu() {
      // 整理参数：需要整理照片墙的数据
      // 携带参数：对于图片，需要携带 imageName与imageUrl字段
      this.spu.spuImageList = this.spuImageList.map(item => {
        return {
          imgName: item.name,
          imgUrl: (item.response && item.response.data) || item.url
        }
      })
      // 发请求
      const res = await this.$API.spu.reqAddOrUpdateSpu(this.spu)
      if (res.code === 200) {
        this.$message.success('保存成功！')
        // 通知父组件回到场景0
        this.$emit('changeScene', { scene: 0, flag: this.spu.id ? '修改' : '添加' })
      }
      // 清除数据
      Object.assign(this._data, this.$options.data())
    },
    // 点击添加SPU按钮的时候，发请求
    async addSpuData(category3Id) {
      // 收集三级分类id
      this.spu.category3Id = category3Id
      // 获取品牌的信息
      const tradeMarkRes = await this.$API.spu.reqTradeMarkList()
      if (tradeMarkRes.code === 200) {
        this.tradeMarkList = tradeMarkRes.data
      }
      // 获取平台销售属性的数据
      const saleRes = await this.$API.spu.reqBaseSaleAttrList()
      if (saleRes.code === 200) {
        this.saleAttrList = saleRes.data
      }
    },
    // 取消按钮
    cancel() {
      // 通知父亲切换场景为0
      this.$emit('changeScene', { scene: 0, flag: '' })
      // 清理数据
      // Object.assign:es6中新增的方法可以合并对象，若有重名的属性值，则后边的对象覆盖前面的属性值。否则后边对象的属性添加到前边对象身上
      // 组件实例this._data,可以操作data当中响应式数据
      // this.$options可以获取配置对象，配置对象的data函数执行，返回的响应式数据为初始时的值，以此来达到一行代码初始化全部数据，不用再一个一个地将数据复制为空
      Object.assign(this._data, this.$options.data())
    }
  }
}
</script>

<style>
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>
