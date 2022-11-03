<template>
  <div>
    <el-row :gutter="10">
      <el-col :span="6">
        <el-card>
          <Detail title="总销售额" :count="`￥${list.salesTotal || 114779}`">
            <!-- 具名插槽charts -->
            <template #charts>
              <div style="font-size: 13px; padding-top: 24px">
                <!-- 由于多个 &nbsp; 无效，所以使用 v-html 原样输出 -->
                <span v-html="`周同比&nbsp;&nbsp;${list.salesGrowthLastMonth || 56.67}%`"></span>
                <svg t="1666956460784" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="9057" width="19" height="19" style="position: absolute; left: 115px; top: 99px">
                  <path d="M512 405.333333L298.666667 618.666667h426.666666L512 405.333333z" fill="#d81e06" p-id="9058"></path>
                </svg>
                <span style="margin-left: 47px" v-html="`日同比&nbsp;&nbsp;${Math.abs(list.salesGrowthLastDay) || 19.16}%`"></span>
                <!-- style="position: absolute; left: 130px; top: 67px" -->
                <svg t="1666957486340" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="11657" width="19" height="19" style="position: absolute; left: 252px; top: 99px">
                  <path d="M512 618.666667L298.666667 405.333333h426.666666L512 618.666667z" fill="#14cb20" p-id="11658"></path>
                </svg>
              </div>
            </template>
            <template #footer>
              <span style="padding-top: 20px">日销售额￥ {{ list.salesToday || 112356 }}</span>
            </template>
          </Detail>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <Detail title="访问量" :count="list.visitTotal || 88460">
            <!-- 折线图 -->
            <template #charts>
              <lineChart :visit-trend="list.visitTrend"></lineChart>
            </template>
            <template #footer>
              <span>日访问量 {{ list.visitToday || 1234 }}</span>
            </template>
          </Detail>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <Detail title="支付笔数" :count="list.payTotal || 182425">
            <!-- 柱状图 -->
            <template #charts>
              <barChart :pay-trend="list.payTrend"></barChart>
            </template>
            <template #footer>
              <span>转化率 {{ list.payRate || 60.2 }}%</span>
            </template>
          </Detail>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <Detail title="运营活动效果" :count="`${list.activityRate || 78}%`">
            <!-- 进度条 -->
            <template #charts>
              <progressChart :activity-rate="list.activityRate"></progressChart>
            </template>
            <template #footer>
              <div style="position: relative">
                <!-- 由于多个 &nbsp; 无效，所以使用 v-html 原样输出 -->
                <span v-html="`周同比&nbsp;&nbsp;${list.activityGrowthLastMonth || 47.12}%`"></span>
                <svg t="1666956460784" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="9057" width="19" height="19" style="position: absolute; left: 97px; top: -1px">
                  <path d="M512 405.333333L298.666667 618.666667h426.666666L512 405.333333z" fill="#d81e06" p-id="9058"></path>
                </svg>
                <span style="margin-left: 47px" v-html="`日同比&nbsp;&nbsp;${Math.abs(list.activityGrowthLastDay) || 17.7}%`"></span>
                <!-- style="position: absolute; left: 130px; top: 67px" -->
                <svg t="1666957486340" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="11657" width="19" height="19" style="position: absolute; left: 233px; top: -1px">
                  <path d="M512 618.666667L298.666667 405.333333h426.666666L512 618.666667z" fill="#14cb20" p-id="11658"></path>
                </svg>
              </div>
            </template>
          </Detail>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import Detail from './Detail'
import lineChart from './lineChart'
import barChart from './barChart'
import progressChart from './progressChart'
import { mapState } from 'vuex'
export default {
  components: {
    Detail,
    lineChart,
    barChart,
    progressChart
  },
  computed: {
    ...mapState('home', ['list'])
  }
}
</script>

<style></style>
