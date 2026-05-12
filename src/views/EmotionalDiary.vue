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
      <el-table-column label="日记内容" prop="diaryContent" wdith="200px"></el-table-column>
      <el-table-column label="操作" fixed="right">
        <template #default="scope">
          <el-button type="primary" @click="handleContentDetail(scope.row)" text>详情</el-button>
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
  </div>
</template>
<script setup>
import PageHead from '../components/PageHead.vue'
import TableSearch from '../components/TableSearch.vue'
import { ref, reactive, onMounted, watch } from 'vue'
import { getMoodList } from '@/api/admin'
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
const handleContentDetail = () => {}
const handleDelete = () => {}
</script>
