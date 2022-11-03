<template>
  <div ref="charts" class="charts"></div>
</template>

<script>
import * as echarts from 'echarts'
export default {
  props: ['activityRate'],
  data() {
    return {
      lineCharts: null
    }
  },
  watch: {
    activityRate() {
      this.lineCharts.setOption({
        series: {
          data: [this.activityRate]
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
        min: 0,
        max: 100
      },
      yAxis: {
        type: 'category',
        // 隐藏y轴
        show: false
      },
      series: [
        {
          type: 'bar',
          // 柱状图的宽度
          barWidth: 10,
          color: 'yellowgreen',
          // 背景颜色设置
          showBackground: true,
          // 设置背景颜色
          backgroundStyle: {
            color: '#eee'
          },
          // 文本标签
          label: {
            show: true,
            // 改变文本内容
            formatter: '|',
            // 文本标签位置调试
            position: 'right',
            // 标签颜色
            color: 'yellowgreen'
          }
        }
      ],
      // 布局调试
      grid: {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0
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
