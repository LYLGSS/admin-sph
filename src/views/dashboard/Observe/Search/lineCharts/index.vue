<template>
  <div>
    <div class="header">
      <span class="search-header">搜索用户数</span>
      <!-- iconfont(info)图标 -->
      <svg t="1666949429973" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2528" width="16" height="16">
        <path d="M512 0C229.23 0 0 229.23 0 512s229.23 512 512 512 512-229.23 512-512S794.77 0 512 0zM512 928c-229.75 0-416-186.25-416-416S282.25 96 512 96s416 186.25 416 416S741.75 928 512 928z" p-id="2529" fill="#bfbfbf"></path>
        <path d="M537.64 343.452c47.074 0 83.266-37.528 83.266-78.072 0-32.46-20.832-60.878-62.496-60.878-54.816 0-82.178 44.618-82.178 77.11C475.144 320.132 498.152 343.452 537.64 343.452z" p-id="2530" fill="#bfbfbf"></path>
        <path
          d="M533.162 728.934c-7.648 0-10.914-10.136-3.264-39.55l43.25-166.406c16.386-60.848 10.944-100.398-21.92-100.398-39.456 0-131.458 39.83-211.458 107.798l16.416 27.392c25.246-17.256 67.906-34.762 77.792-34.762 7.648 0 6.56 10.168 0 35.508l-37.746 158.292c-23.008 89.266 1.088 109.538 33.984 109.538 32.864 0 117.808-30.47 195.57-109.632l-18.656-25.34C575.354 716.714 543.05 728.934 533.162 728.934z"
          p-id="2531"
          fill="#bfbfbf"
        ></path>
      </svg>
    </div>
    <div class="main">
      <span class="main-title">12321</span>
      <span class="main-content">17.1</span>
      <svg t="1666956460784" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="9057" width="23" height="23" style="position: absolute; left: 116px; top: 5px">
        <path d="M512 405.333333L298.666667 618.666667h426.666666L512 405.333333z" fill="#d81e06" p-id="9058"></path>
      </svg>
      <svg t="1666957486340" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="11657" width="23" height="23" style="position: absolute; left: 116px; top: 5px">
        <path d="M512 618.666667L298.666667 405.333333h426.666666L512 618.666667z" fill="#14cb20" p-id="11658"></path>
      </svg>
    </div>
    <div class="footer">
      <div ref="charts" class="charts"></div>
    </div>
  </div>
</template>

<script>
import * as echarts from 'echarts'
export default {
  mounted() {
    // 初始化echarts实例
    const lineCharts = echarts.init(this.$refs.charts)
    // 配置数据
    lineCharts.setOption({
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
          data: [20, 12, 26, 37, 20, 10, 36, 12, 25],
          // 拐点透明度（0为不显示）
          itemStyle: {
            opacity: 0
          },
          // 线条的样式
          lineStyle: {
            color: 'rgb(120,165,236)'
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
                  color: 'rgb(120,165,236)' // 0% 处的颜色
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
.header {
  display: flex;
  align-items: center;
}
.search-header {
  margin-right: 10px;
  color: rgb(151, 151, 151);
  font-size: 14px;
}
.main {
  margin: 20px 0 10px 0;
  position: relative;
}
.main-title {
  font-size: 24px;
  margin-right: 20px;
}
.main-content {
  color: rgb(151, 151, 151);
}
.charts {
  width: 100%;
  height: 50px;
}
.footer {
  margin-bottom: 15px;
}
</style>
