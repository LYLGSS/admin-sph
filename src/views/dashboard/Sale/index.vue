<template>
  <div>
    <el-card class="box-card" style="margin: 10px 0px">
      <div slot="header" class="clearfix">
        <!--  v-model="activeName" @tab-click="handleClick" -->
        <!-- 头部左侧内容 -->
        <el-tabs v-model="activeName" class="tab">
          <el-tab-pane label="销售额" name="sale"></el-tab-pane>
          <el-tab-pane label="访问量" name="visite"></el-tab-pane>
        </el-tabs>
        <!-- 头部右侧内容 -->
        <div class="right">
          <span @click="setDay">今日</span>
          <span @click="setWeek">本周</span>
          <span @click="setMonth">本月</span>
          <span @click="setYear">本年</span>
          <!-- v-model="value1"  -->
          <el-date-picker v-model="date" class="date" type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" size="mini" value-format="yyyy-MM-dd" style="width: 220px"> </el-date-picker>
        </div>
      </div>
      <div>
        <el-row :gutter="10">
          <el-col :span="19">
            <!-- 容器 -->
            <div ref="charts" class="charts"></div>
          </el-col>
          <el-col :span="5">
            <div class="paiming">
              <h3>门店{{ title }}排名</h3>
              <ul>
                <li v-for="(item, index) in rank" :key="index">
                  <span :class="index < 3 ? 'rindex' : 'noindex'">{{ item.no }}</span>
                  <span>{{ item.name }}</span>
                  <span class="num">{{ item.money }}</span>
                </li>
              </ul>
            </div>
          </el-col>
        </el-row>
      </div>
    </el-card>
  </div>
</template>

<script>
// 引入echarts
import * as echarts from 'echarts'
import { mapGetters, mapState } from 'vuex'
import dayjs from 'dayjs'
export default {
  data() {
    return {
      activeName: 'sale',
      myCharts: null,
      // 收集日历数据
      date: []
    }
  },
  computed: {
    // 计算属性--标题
    title() {
      return this.activeName === 'sale' ? '销售额' : '访问量'
    },
    ...mapState('home', ['list']),
    ...mapGetters('home', ['orderRank']),
    ...mapGetters('home', ['userRank']),
    // 排名列表的数据
    rank() {
      return this.title === '销售额' ? this.orderRank : this.userRank
    }
  },
  watch: {
    title() {
      // title变化的时候，修改图表的数据
      this.myCharts.setOption({
        title: {
          text: this.title + '趋势'
        },
        xAxis: {
          data: this.title === '销售额' ? this.list.orderFullYearAxis : this.list.userFullYearAxis
        },
        series: {
          data: this.title === '销售额' ? this.list.orderFullYear : this.list.userFullYear
        }
      })
    },
    list() {
      // 监听到list的数据返回的时候，设置图表初始数据
      this.myCharts.setOption({
        xAxis: {
          show: true,
          data: this.list.orderFullYearAxis
        },
        series: {
          data: this.list.orderFullYear
        }
      })
    }
  },
  mounted() {
    // 初始化echarts实例
    this.myCharts = echarts.init(this.$refs.charts)
    // 配置数据
    this.myCharts.setOption({
      title: {
        text: '销售额趋势'
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        show: false,
        type: 'category',
        axisTick: {
          alignWithLabel: true
        }
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          name: 'Direct',
          type: 'bar',
          barWidth: '60%'
        }
      ]
    })
  },
  methods: {
    // 本天
    setDay() {
      const day = dayjs().format('YYYY-MM-DD')
      this.date = [day, day]
    },
    // 本周
    setWeek() {
      const start = dayjs().day(1).format('YYYY-MM-DD')
      const end = dayjs().day(7).format('YYYY-MM-DD')
      this.date = [start, end]
    },
    // 本月
    setMonth() {
      const start = dayjs().startOf('month').format('YYYY-MM-DD')
      const end = dayjs().endOf('month').format('YYYY-MM-DD')
      this.date = [start, end]
    },
    // 本年
    setYear() {
      const start = dayjs().startOf('year').format('YYYY-MM-DD')
      const end = dayjs().endOf('year').format('YYYY-MM-DD')
      this.date = [start, end]
    }
  }
}
</script>

<style scoped>
::v-deep .el-card__header {
  border-bottom: none;
  padding-bottom: 0;
}
::v-deep .el-card__body {
  padding-top: 5px;
}
.clearfix {
  display: flex;
  justify-content: space-between;
  position: relative;
}
.tab {
  width: 100%;
}
.right {
  position: absolute;
  right: 0;
}
.date {
  width: 200px;
  margin-left: 20px;
}
.right span {
  margin: 0 10px;
  font-size: 14px;
  cursor: pointer;
}
.charts {
  width: 100%;
  height: 300px;
}
.paiming {
  width: 100%;
  height: 300px;
}
ul {
  list-style: none;
  padding-left: 0;
}
ul li {
  margin: 20px 0;
}
h3 {
  margin-top: 0;
}
.rindex {
  display: inline-block;
  text-align: center;
  width: 17px;
  height: 17px;
  background-color: black;
  color: white;
  border-radius: 50%;
  margin-right: 20px;
}
.noindex {
  margin: 0 24px 0 4px;
}
.num {
  float: right;
}
</style>
