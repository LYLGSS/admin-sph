<template>
  <div ref="charts" class="charts"></div>
</template>

<script>
import * as echarts from 'echarts'
export default {
  props: ['visitTrend'],
  data() {
    return {
      lineCharts: null
    }
  },
  watch: {
    visitTrend() {
      this.lineCharts.setOption({
        series: {
          data: this.visitTrend
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
          type: 'line',
          // 拐点透明度（0为不显示）
          itemStyle: {
            opacity: 0
          },
          // 线条的样式
          lineStyle: {
            color: 'rgb(159, 127, 223)'
          },
          // 区域填充样式
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                {
                  offset: 0,
                  color: 'rgb(159, 127, 223)' // 0% 处的颜色
                },
                {
                  offset: 1,
                  color: 'white' // 100% 处的颜色
                }
              ]
            }
          },
          // 平滑效果
          smooth: true
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
