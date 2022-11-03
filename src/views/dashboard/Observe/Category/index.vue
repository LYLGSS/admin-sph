<template>
  <div>
    <el-card>
      <div slot="header">
        <div class="category-header">
          <div slot="header">销售额类别占比</div>
          <div class="button">
            <el-radio-group v-model="value" size="mini" @change="updateCharts">
              <el-radio-button label="全部渠道"></el-radio-button>
              <el-radio-button label="线上"></el-radio-button>
              <el-radio-button label="门店"></el-radio-button>
            </el-radio-group>
          </div>
        </div>
      </div>
      <div>
        <div ref="charts" class="charts"></div>
      </div>
    </el-card>
  </div>
</template>

<script>
import * as echarts from 'echarts'
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      value: '全部渠道',
      myCharts: null
    }
  },
  computed: {
    ...mapGetters('home', ['saleRank']),
    rank() {
      const list = []
      if (this.value === '全部渠道') {
        if (!this.saleRank) return // 当vuex仓库中的saleRank还没有返回时，值为undefined，下一行代码会报错，这里需要做一下判断
        for (let i = 0; i < this.saleRank.online.name.length; i++) {
          let obj = {}
          obj.value = this.saleRank.online.value[i] + this.saleRank.shop.value[i]
          obj.name = this.saleRank.online.name[i]
          list.push(obj)
          obj = null
        }
      } else if (this.value === '线上') {
        for (let i = 0; i < this.saleRank.online.name.length; i++) {
          // 每次循环创建一个新对象，循环结束将对象置空，若在循环体外部创建obj对象，则每次循环修改的都为obj（所有修改的obj引用地址相同），即使obj已经push到数组中，导致最后数组中的所有数据都是最后一次修改后的数据
          let obj = {}
          obj.value = this.saleRank.online.value[i]
          obj.name = this.saleRank.online.name[i]
          list.push(obj)
          obj = null
        }
      } else {
        for (let i = 0; i < this.saleRank.shop.name.length; i++) {
          let obj = {}
          obj.value = this.saleRank.shop.value[i]
          obj.name = this.saleRank.shop.name[i]
          list.push(obj)
          obj = null
        }
      }
      return list
    }
  },
  watch: {
    // 数据返回的时候，更新图表
    saleRank() {
      this.updateCharts()
    }
  },
  mounted() {
    this.myCharts = echarts.init(this.$refs.charts)
    this.myCharts.setOption({
      title: {
        left: 'center',
        top: 'center'
      },
      series: [
        {
          // name: 'Access From',
          type: 'pie',
          radius: ['40%', '70%'],
          avoidLabelOverlap: false,
          itemStyle: {
            // borderRadius: 10,
            borderColor: '#fff',
            borderWidth: 2
          },
          label: {
            show: true,
            position: 'outside'
          },
          labelLine: {
            show: true
          }
          // data: [
          // { value: 300, name: '视频广告' },
          // { value: 484, name: '联盟广告' },
          // { value: 580, name: '邮件营销' },
          // { value: 735, name: '直接访问' },
          // { value: 1048, name: '搜索引擎' }
          // ]
        }
      ]
    })
    //  绑定事件
    this.myCharts.on('mouseover', params => {
      // 获取鼠标移上去的那条数据
      const { name, value } = params.data
      // 重新设置标题
      this.myCharts.setOption({
        title: {
          text: name,
          subtext: value
        }
      })
    })
  },
  methods: {
    updateCharts(params) {
      this.myCharts.setOption({
        title: {
          text: this.rank[0].name,
          subtext: this.rank[0].value,
          subtextStyle: {
            fontSize: 18
          }
        },
        series: {
          data: this.rank
        }
      })
      // console.log(params)
    }
  }
}
</script>

<style scoped>
.category-header {
  position: relative;
}
.button {
  position: absolute;
  right: 0px;
  top: -5px;
}
.charts {
  width: 100%;
  height: 300px;
}
</style>
