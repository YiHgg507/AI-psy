<template>
  <div class="dashboard-container">
    <el-row :gutter="20" v-loading="loading">
      <el-col :span="6">
        <el-card shadow="always">
          <div class="card-content">
            <div class="avatar users">
              <el-image :src="iconUrl1" style="width: 40px; height: 40px"></el-image>
            </div>
            <div class="info">
              <p class="title">总用户数</p>
              <p class="number">{{ analyzeData.systemOverview.totalUsers }}</p>
              <p class="subtitle-title">活跃用户数{{ analyzeData.systemOverview.activeUsers }}</p>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="always">
          <div class="card-content">
            <div class="avatar like">
              <el-image :src="iconUrl2" style="width: 40px; height: 40px"></el-image>
            </div>
            <div class="info">
              <p class="title">情绪日志</p>
              <p class="number">{{ analyzeData.systemOverview.totalDiaries }}</p>
              <p class="subtitle-title">今日新增{{ analyzeData.systemOverview.todayNewDiaries }}</p>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="always">
          <div class="card-content">
            <div class="avatar comments">
              <el-image :src="iconUrl3" style="width: 40px; height: 40px"></el-image>
            </div>
            <div class="info">
              <p class="title">咨询会话</p>
              <p class="number">{{ analyzeData.systemOverview.totalSessions }}</p>
              <p class="subtitle-title">
                今日新增{{ analyzeData.systemOverview.todayNewSessions }}
              </p>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="always">
          <div class="card-content">
            <div class="avatar smile">
              <el-image :src="iconUrl4" style="width: 40px; height: 40px"></el-image>
            </div>
            <div class="info">
              <p class="title">平均情绪</p>
              <p class="number">{{ analyzeData.systemOverview.avgMoodScore }}/10</p>
              <p class="subtitle-title">情绪健康指数</p>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="20" style="margin-top: 20px" v-loading="loading">
      <el-col :span="12">
        <el-card shadow="always" wdith="100%" v-if="analyzeData.emotionTrend">
          <template #header>
            <div class="card-header">情绪趋势分析</div>
          </template>
          <div class="chart-content">
            <div ref="emotionChartRef" style="width: 100%; height: 300px"></div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card shadow="always" wdith="100%">
          <template #header>
            <div class="card-header">咨询会话统计</div>
          </template>
          <div class="chart-content">
            <div class="consultation-stats" v-if="analyzeData.consultationStats.totalSessions">
              <div class="stat-item">
                <div class="stat-label">总会话数</div>
                <div class="stat-value">{{ analyzeData.consultationStats.totalSessions }}</div>
              </div>
              <div class="stat-item">
                <div class="stat-label">平均时长</div>
                <div class="stat-value">{{ analyzeData.consultationStats.avgDurationMinutes }}</div>
              </div>
              <div class="stat-item">
                <div class="stat-label">活跃用户</div>
                <div class="stat-value">{{ analyzeData.systemOverview.activeUsers }}</div>
              </div>
            </div>
            <div ref="ConsultationChartRef" style="width: 100%; height: 260px"></div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="20" style="margin-top: 20px" v-loading="loading">
      <el-col>
        <el-card shadow="always" wdith="100%">
          <template #header>
            <div class="card-header">用户活跃度趋势</div>
          </template>
          <div class="chart-content">
            <div ref="userActivityChatRef" style="width: 100%; height: 300px"></div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
<script setup>
import { onMounted, ref } from 'vue'
import { getComAnalysis } from '@/api/admin'
import * as echarts from 'echarts'
// 引入图片
const iconUrl1 = new URL('@/assets/users.png', import.meta.url).href
const iconUrl2 = new URL('@/assets/like.png', import.meta.url).href
const iconUrl3 = new URL('@/assets/comments.png', import.meta.url).href
const iconUrl4 = new URL('@/assets/smile.png', import.meta.url).href

// 获取数据
const analyzeData = ref({
  systemOverview: {
    totalUsers: 0,
    activeUsers: 0,
    totalDiaries: 0,
    todayNewDiaries: 0,
    totalSessions: 0,
    todayNewSessions: 0,
    avgMoodScore: 0
  },
  consultationStats: {
    totalSessions: 0,
    avgDurationMinutes: 0
  },
  emotionTrend: [],
  dailyTrend: []
})

// 情绪图表
let emotionChart = null
const emotionChartRef = ref(null)

// 情绪分析
const initEmotionalEcharts = () => {
  if (!emotionChartRef.value) return
  if (emotionChart) {
    emotionChart.dispose()
  }
  // 创建echarts实例
  emotionChart = echarts.init(emotionChartRef.value)
  // 获取数据
  const trandData = analyzeData.value.emotionTrend || []
  // 配置项
  const options = {
    title: {
      text: '情绪趋势分析',
      textStyle: {
        color: '#2d3436',
        fontSize: 16,
        fontWeight: 600
      },
      left: 'center',
      top: 10
    },
    tooltip: {
      trigger: 'axis',
      bordercolor: '#fab1a0',
      textStyle: {
        color: '#2d3436'
      }
    },
    legend: {
      data: ['平均情绪评分', '记录数量'],
      top: 40
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      top: 80
    },
    xAxis: {
      type: 'category',
      data: trandData.map((item) => item.date),
      axisline: {
        lineStyle: {
          color: '#2d3436'
        }
      }
    },
    yAxis: [
      {
        type: 'value',
        name: '平均情绪评分',
        position: 'left',
        axisline: {
          lineStyle: {
            color: '#2d3436'
          }
        }
      },
      {
        type: 'value',
        name: '记录数量',
        position: 'right',
        axisline: {
          lineStyle: {
            color: '#2d3436'
          }
        }
      }
    ],
    series: [
      {
        name: '平均情绪评分',
        type: 'line',
        data: trandData.map((item) => item.avgMoodScore),
        smooth: true,
        lineStyle: {
          width: 3,
          color: '#faebaf'
        },
        itemStyle: {
          color: '#faebaf'
        }
      },
      {
        name: '记录数量',
        type: 'line',
        data: trandData.map((item) => item.recordCount),
        smooth: true,
        lineStyle: {
          width: 3,
          color: '#eeb5a3'
        },
        itemStyle: {
          color: '#eeb5a3'
        }
      }
    ]
  }
  // 设置图表
  emotionChart.setOption(options)
}

// 会话统计
let ConsultationChart = null
const ConsultationChartRef = ref(null)
const initConsultationEcharts = () => {
  if (!ConsultationChartRef.value) return
  if (ConsultationChart) {
    ConsultationChart.dispose()
  }
  // 创建echarts实例
  ConsultationChart = echarts.init(ConsultationChartRef.value)
  // 获取数据
  const dailyTrend = analyzeData.value.consultationStats.dailyTrend || []
  console.log(dailyTrend, 'dailyTrend')
  const option = {
    title: {
      text: '咨询活动统计',
      textStyle: {
        fontSize: 16,
        fontWeight: 600,
        color: '#2d3436'
      },
      left: 'center',
      top: 10
    },
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderColor: '#fab1a0',
      borderWidth: 1,
      textStyle: {
        color: '#2d3436'
      }
    },
    legend: {
      data: ['会话数量', '参与用户数'],
      top: 40,
      textStyle: {
        color: '#636e72'
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      top: 80,
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: dailyTrend.map((item) => item.date),
      axisLine: {
        lineStyle: {
          color: 'rgba(244, 162, 97, 0.3)'
        }
      },
      axisLabel: {
        color: '#636e72'
      }
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        color: '#636e72'
      },
      axisLine: {
        lineStyle: {
          color: 'rgba(244, 162, 97, 0.3)'
        }
      },
      splitLine: {
        lineStyle: {
          color: 'rgba(244, 162, 97, 0.1)'
        }
      }
    },
    series: [
      {
        name: '会话数量',
        type: 'bar',
        data: dailyTrend.map((item) => item.sessionCount),
        itemStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: '#74b9ff' },
              { offset: 1, color: '#0984e3' }
            ]
          }
        },
        barWidth: '40%'
      },
      {
        name: '参与用户数',
        type: 'bar',
        data: dailyTrend.map((item) => item.userCount),
        itemStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: '#fdcb6e' },
              { offset: 1, color: '#f39c12' }
            ]
          }
        },
        barWidth: '40%'
      }
    ]
  }
  ConsultationChart.setOption(option)
}

//活跃度趋势
let userActivityChart = null
const userActivityChatRef = ref(null)
const initUserActivityEcharts = () => {
  if (!userActivityChatRef.value) return
  if (userActivityChart) {
    userActivityChart.dispose()
  }
  userActivityChart = echarts.init(userActivityChatRef.value)
  const activityData = analyzeData.value.userActivity || []
  const option = {
    title: {
      text: '用户活跃度趋势',
      textStyle: {
        fontSize: 16,
        fontWeight: 600,
        color: '#2d3436'
      },
      left: 'center',
      top: 10
    },
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderColor: '#fab1a0',
      borderWidth: 1,
      textStyle: {
        color: '#2d3436'
      }
    },
    legend: {
      data: ['活跃用户', '新增用户', '日记用户', '咨询用户'],
      top: 40,
      textStyle: {
        color: '#636e72'
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      top: 80,
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: activityData.map((item) => item.date),
      axisLine: {
        lineStyle: {
          color: 'rgba(244, 162, 97, 0.3)'
        }
      },
      axisLabel: {
        color: '#636e72'
      }
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        color: '#636e72'
      },
      axisLine: {
        lineStyle: {
          color: 'rgba(244, 162, 97, 0.3)'
        }
      },
      splitLine: {
        lineStyle: {
          color: 'rgba(244, 162, 97, 0.1)'
        }
      }
    },
    series: [
      {
        name: '活跃用户',
        type: 'line',
        data: activityData.map((item) => item.activeUsers),
        smooth: true,
        lineStyle: {
          width: 3,
          color: '#a29bfe'
        },
        itemStyle: {
          color: '#a29bfe'
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(162, 155, 254, 0.4)' },
              { offset: 1, color: 'rgba(162, 155, 254, 0.1)' }
            ]
          }
        }
      },
      {
        name: '新增用户',
        type: 'line',
        data: activityData.map((item) => item.newUsers),
        smooth: true,
        lineStyle: {
          width: 3,
          color: '#fdcb6e'
        },
        itemStyle: {
          color: '#fdcb6e'
        }
      },
      {
        name: '日记用户',
        type: 'line',
        data: activityData.map((item) => item.diaryUsers),
        smooth: true,
        lineStyle: {
          width: 3,
          color: '#00b894'
        },
        itemStyle: {
          color: '#00b894'
        }
      },
      {
        name: '咨询用户',
        type: 'line',
        data: activityData.map((item) => item.consultationUsers),
        smooth: true,
        lineStyle: {
          width: 3,
          color: '#fab1a0'
        },
        itemStyle: {
          color: '#fab1a0'
        }
      }
    ]
  }
  userActivityChart.setOption(option)
}

// 初始化图表集成
const initCharts = () => {
  initEmotionalEcharts()
  initConsultationEcharts()
  initUserActivityEcharts()
}

const loading = ref(true)
onMounted(async () => {
  const res = await getComAnalysis()
  console.log(res, 'API返回的完整数据')
  analyzeData.value = { ...analyzeData.value, ...res }
  loading.value = false
  initCharts()
})
</script>

<style scoped lang="scss">
.dashboard-container {
  .card-content {
    display: flex;
    align-items: center;
    .avatar {
      margin-right: 12px;
      width: 60px;
      height: 60px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      &.users {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      }
      &.like {
        background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
      }
      &.comments {
        background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
      }
      &.smile {
        background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
      }
    }
    .info {
      .title {
        font-size: 14px;
        color: #7f8c8d;
        margin-bottom: 4px;
      }
      .number {
        font-size: 24px;
        font-weight: 700;
        color: #2c3e50;
        margin-bottom: 4px;
      }
      .subtitle-title {
        font-size: 12px;
        color: #95a5a6;
      }
    }
  }
  .chart-content {
    padding: 20px;
    height: 300px;
    position: relative;

    canvas {
      width: 100% !important;
      height: 100% !important;
    }

    .consultation-stats {
      display: flex;
      justify-content: space-around;
      margin-bottom: 20px;

      .stat-item {
        text-align: center;

        .stat-label {
          font-size: 12px;
          color: #7f8c8d;
          margin-bottom: 4px;
        }

        .stat-value {
          font-size: 18px;
          font-weight: 600;
          color: #2c3e50;
        }
      }
    }
  }
}
</style>
