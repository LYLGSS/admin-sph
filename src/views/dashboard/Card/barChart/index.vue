<template>
  <div ref="charts" class="charts"></div>
</template>

<script>
import * as echarts from 'echarts'
export default {
  props: ['payTrend'],
  data() {
    return {
      lineCharts: null
    }
  },
  watch: {
    payTrend() {
      this.lineCharts.setOption({
        series: {
          data: this.payTrend
        }
      })
    }
  },
  mounted() {
    // 初始化echarts实例
    this.lineCharts = echarts.init(this.$refs.charts)
    // 配置数据
    this.lineCharts.setOption({
      xAxis: {
        // 隐藏x轴
        show: false,
        type: 'category'
      },
      yAxis: {
        // 隐藏y轴
        show: false
      },
      series: [
        {
          type: 'bar'
        }
      ],
      // 布局调试
      grid: {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0
      },
      tooltip: {
        show: true
      }
    })
  }
}
</script>

<style scoped>
.charts {
  width: 100%;
  height: 100%;
}
</style>
