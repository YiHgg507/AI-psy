<template>
  <div>
    <PageHead title="情绪日志" />
    <TableSearch :formItem="formItem" @search="handleSearch" />
    <el-table :data="emotiondata">
      <el-table-column label="用户ID" prop="userId" width="100px"></el-table-column>
      <el-table-column label="会话ID" width="100px">
        <template #default="scope">
          <el-avatar>{{ scope.row.nickname }}</el-avatar>
        </template>
      </el-table-column>
      <el-table-column label="记录日期" prop="diaryDate" width="120px"></el-table-column>
      <el-table-column label="情绪评分" width="350px">
        <template #default="scope">
          <el-rate
            :model-value="scope.row.moodScore"
            disabled
            show-score
            text-color="#ff9900"
            :max="10"
          />
        </template>
      </el-table-column>
      <el-table-column label="生活指标" width="150px">
        <template #default="scope">
          <div>睡眠:{{ scope.row.sleepQuality }}/5</div>
          <div>压力:{{ scope.row.stressLevel }}/5</div>
        </template>
      </el-table-column>
      <el-table-column label="情绪触发因素" prop="emotionTriggers" width="200px"></el-table-column>
      <el-table-column label="日记内容" prop="diaryContentPreview" wdith="200px"></el-table-column>
      <el-table-column label="操作" fixed="right">
        <template #default="scope">
          <el-button type="primary" @click="handleDialogDetail(scope.row)" text>详情</el-button>
          <el-button type="danger" @click="handleDelete(scope.row)" text>删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      style="margin-top: 25px"
      layout="prev, pager, next"
      :total="pagination.total"
      :page-size="pagination.size"
      v-model:current-page="pagination.current"
    ></el-pagination>
    <div v-if="currentDetail" class="detail-content">
      <el-dialog
        title="情绪日志详情"
        v-model="dialogVisible"
        width="800px"
        :close-on-click-modal="false"
      >
        <div class="detail-section"></div>
        <h4>用户信息</h4>
        <el-descriptions :column="2" size="large" border>
          <el-descriptions-item label="用户名">{{ currentDetail.username }}</el-descriptions-item>
          <el-descriptions-item label="昵称">{{ currentDetail.nickname }}</el-descriptions-item>
          <el-descriptions-item label="用户ID">{{ currentDetail.userId }}</el-descriptions-item>
          <el-descriptions-item label="记录日期">{{
            currentDetail.diaryDate
          }}</el-descriptions-item>
        </el-descriptions>
        <div class="detail-section"></div>
        <h4>情绪状态</h4>
        <el-descriptions :column="2" size="large" border>
          <el-descriptions-item label="情绪评分"
            ><el-rate
              v-model="currentDetail.moodScore"
              disabled
              show-score
              text-color="#ff9900"
              :max="10"
              style="text-align: center"
          /></el-descriptions-item>
          <el-descriptions-item label="主要情绪" label-align="left" align="center">
            <el-tag
              :type="getEmotionTagType(currentDetail.dominateEmotion)"
              effect="light"
              size="large"
              >{{ currentDetail.dominateEmotion || '-' }}</el-tag
            >
          </el-descriptions-item>
          <el-descriptions-item label="睡眠质量"
            >{{ currentDetail.sleepQuality || '-' }}/5</el-descriptions-item
          >
          <el-descriptions-item label="压力水平"
            >{{ currentDetail.stressLevel || '-' }}/5</el-descriptions-item
          >
        </el-descriptions>
        <div class="detail-section"></div>
        <h4>日记内容</h4>
        <el-descriptions :column="2" size="large" border>
          <el-descriptions-item label="情绪触发因素" :span="2">{{
            currentDetail.emotionTriggers || '无'
          }}</el-descriptions-item>
          <el-descriptions-item label="日记内容" :span="2">{{
            currentDetail.diaryContent || '无'
          }}</el-descriptions-item>
        </el-descriptions>
        <div v-if="currentDetail.aiAnalysisStatus === 'COMPLETED'" class="ai-analysis-result">
          <div class="detail-section"></div>
          <h4>AI情绪分析结果</h4>
          <el-descriptions :column="2" size="large" border>
            <el-descriptions-item label="主要情绪">
              <el-tag :type="getAiEmotionTagType(airesult.primaryEmotion)">{{
                airesult.primaryEmotion
              }}</el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="情绪强度">
              <el-progress
                :percentage="airesult.emotionScore"
                :color="getEmotionScoreColor(airesult.emotionScore)"
                :stroke-width="8"
              ></el-progress>
            </el-descriptions-item>
            <el-descriptions-item label="风险等级">
              <el-tag :type="getRiskLevelTagType(airesult.riskLevel)">{{
                getRiskLevelText(airesult.riskLevel)
              }}</el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="情绪性质">
              <el-tag :type="airesult.isNegative ? 'danger' : 'success'">{{
                airesult.isNegative ? '负面情绪' : '正面情绪'
              }}</el-tag>
            </el-descriptions-item>
          </el-descriptions>
          <div class="ai-suggestion-section">
            <h5>专业建议</h5>
            <div class="suggestion-content">{{ airesult.suggestion || '无' }}</div>
          </div>
          <div class="air-risk-section">
            <h5>风险描述</h5>
            <div class="suggestion-content">{{ airesult.riskDescription || '无' }}</div>
          </div>
          <div class="air-improvements-section">
            <h5>改善建议</h5>
            <ul class="improvement-list">
              <li v-for="item in airesult.improvementSuggestions" :key="item">{{ item }}</li>
            </ul>
          </div>
        </div>
        <div class="detail-section"></div>
        <h4>时间信息</h4>
        <el-descriptions :column="2" border>
          <el-descriptions-item label="创建时间">{{
            currentDetail.createdAt
          }}</el-descriptions-item>
          <el-descriptions-item label="更新时间">{{
            currentDetail.updatedAt
          }}</el-descriptions-item>
        </el-descriptions>
        <template #footer>
          <el-button @click="dialogVisible = false">关闭</el-button>
        </template>
      </el-dialog>
    </div>
  </div>
</template>
<script setup>
import PageHead from '../components/PageHead.vue'
import TableSearch from '../components/TableSearch.vue'
import { ref, reactive, onMounted, watch } from 'vue'
import { getMoodList, deleteMoodRecord } from '@/api/admin'
import { ElMessageBox, ElMessage } from 'element-plus'
const formItem = ref([
  { comp: 'input', prop: 'userId', label: '用户ID', placeholder: '请输入用户ID' },
  {
    comp: 'select',
    prop: 'moodScoreRange',
    label: '情绪评分',
    placeholder: '请选择评分范围',
    options: [
      { label: '低分(1-3)', value: '1-3' },
      { label: '中分(4-6)', value: '4-6' },
      { label: '高分(7-10)', value: '7-10' }
    ]
  }
])
// 保存筛选条件，翻页时复用
// lastFormData 搜索条件 用户ID 以及情绪评分范围
const lastFormData = ref({})
const handleSearch = (formData) => {
  if (formData) {
    lastFormData.value = formData
  }
  if (pagination.current === 1) {
    getMoodData() // 已经在第一页，watch 不会触发，手动调
  } else {
    pagination.current = 1 // 触发 watch → getMoodData()
  }
}

// 获取表单数据
const emotiondata = ref([])
const pagination = reactive({
  current: 1,
  size: 10,
  total: 0
})

watch(
  () => pagination.current,
  () => {
    getMoodData()
  }
)
// 获取数据
const getMoodData = async () => {
  const { moodScoreRange, ...rest } = lastFormData.value
  const params = {
    current: pagination.current,
    size: pagination.size
  }
  // 只把有值的筛选条件拼进去，过滤掉 undefined 和空字符串
  Object.entries(rest).forEach(([key, value]) => {
    if (value !== undefined && value !== '' && value !== 'all') {
      params[key] = value
    }
  })
  if (moodScoreRange && moodScoreRange !== 'all') {
    const [min, max] = moodScoreRange.split('-')
    params.minMoodScore = Number(min)
    params.maxMoodScore = Number(max)
  }
  // console.log('getMoodData 发出的参数：', JSON.stringify(params))
  const res = await getMoodList(params)
  // console.log('getMoodData 返回数据：', res)
  emotiondata.value = res.records || []
  pagination.total = res.total
}
onMounted(async () => {
  getMoodData()
  console.log(emotiondata.value, 'emotiondata')
})

// 操作 详情/删除
const dialogVisible = ref(false)
const currentDetail = ref({})
const airesult = ref([])
const handleDialogDetail = (row) => {
  currentDetail.value = row
  if (row.aiEmotionAnalysis) {
    airesult.value = JSON.parse(row.aiEmotionAnalysis)
    console.log(airesult.value, 'airesult')
  } else {
    airesult.value = {}
  }
  dialogVisible.value = true
  console.log(row, 'row')
}

// 情绪对应颜色修改模块
const getEmotionTagType = (emotion) => {
  const emotionTypes = {
    快乐: 'success',
    平静: 'info',
    兴奋: 'warning',
    愤怒: 'danger',
    悲伤: 'info',
    焦虑: 'warning'
  }
  return emotionTypes[emotion] || 'info'
}

const getAiEmotionTagType = (emotion) => {
  const emotionTagMap = {
    快乐: 'success',
    平静: 'success',
    兴奋: 'warning',
    满足: 'success',
    愤怒: 'danger',
    悲伤: 'info',
    焦虑: 'warning',
    恐惧: 'danger',
    沮丧: 'info',
    压力: 'warning'
  }
  return emotionTagMap[emotion] || 'info'
}

const getEmotionScoreColor = (score) => {
  if (score >= 80) return '#f56c6c'
  if (score >= 60) return '#e6a23c'
  if (score >= 40) return '#909399'
  return '#67c23a'
}

const getRiskLevelTagType = (riskLevel) => {
  const riskTagMap = {
    0: 'success',
    1: 'info',
    2: 'warning',
    3: 'danger'
  }
  return riskTagMap[riskLevel] || 'info'
}

const getRiskLevelText = (riskLevel) => {
  const riskTextMap = {
    0: '正常',
    1: '关注',
    2: '预警',
    3: '危机'
  }
  return riskTextMap[riskLevel] || '未知风险等级'
}
const handleDelete = (row) => {
  ElMessageBox.confirm('确定要删除吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(async () => {
      await deleteMoodRecord(row.id)
      handleSearch()
      ElMessage.success('删除成功')
    })
    .catch((err) => {
      if (err !== 'cancel' && err !== 'close') {
        ElMessage.error('删除失败')
        console.error(err)
      }
    })
}
</script>
<style scoped lang="scss">
h4 {
  margin-top: 16px;
  margin-bottom: 8px;
  color: #303133;
  font-size: 16px;
  font-weight: 600;
}
:deep(.el-descriptions__label) {
  background: var(--el-color-primary-light-9) !important;
}
:deep(.el-descriptions__body .el-descriptions__table) {
  border-color: var(--el-border-color-darker);
}

.ai-analysis-result {
  .ai-suggestion-section,
  .air-risk-section,
  .air-improvements-section {
    margin-top: 10px;
    padding: 12px;
    background-color: var(--el-color-primary-light-9);
    border-radius: 4px;

    h5 {
      margin: 0 0 8px 0;
      color: #606266;
      font-size: 14px;
      font-weight: 600;
    }
  }

  .suggestion-content {
    line-height: 1.6;
    color: #606266;
    background-color: white;
    padding: 8px;
    border-radius: 4px;
    border: 1px solid #ebeef5;
  }

  .improvement-list {
    margin: 0;
    padding-left: 20px;

    li {
      margin-bottom: 4px;
      color: #606266;
      line-height: 1.5;
    }
  }
}
</style>
