<template>
  <!-- 面包屑导航区 -->
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>统计数据</el-breadcrumb-item>
    <el-breadcrumb-item>数据列表</el-breadcrumb-item>
  </el-breadcrumb>
  <!-- 卡片视图 -->
  <el-card>
    <div id="main" style="width: 750px; height: 400px"></div>
  </el-card>
</template>

<script>
import _ from 'lodash'
import { getreports } from '../../network/Report'
import * as echarts from 'echarts'
export default {
  name: 'Report',
  data () {
    return {

      // 需要合并的数据
      options: {
        title: {
          text: '用户来源'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#E9EEF3'
            }
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            boundaryGap: false
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ]
      }
    }
  },

  mounted () {
    // 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.getElementById('main'));

    // 准备数据和配置项
    getreports().then(res => {
      if (res.data.meta.status !== 200) {
        return ElMessage.error('获取折线图数据失败')
      }
      // 准备数据的配置项
      const result = _.merge(res.data.data, this.options)
      // 展示数据
      myChart.setOption(result);
    })

  }


}
</script>

<style>
</style>