<template>
  <div>
    <PageHead title="知识文章">
      <template #buttons>
        <el-button type="primary" @click="dialogVisible = true">新增</el-button>
        <!-- <el-button type="primary">编辑</el-button> -->
      </template>
    </PageHead>
    <TableSearch :formItem="formItem" @search="handleSearch" />
    <el-table :data="tableData" style="width: 100%; margin-top: 25px">
      <el-table-column label="文章标题" fixed="left" width="350">
        <template #default="scope">
          <div style="display: flex; align-items: center">
            <el-icon><timer /></el-icon>
            <span>{{ scope.row.title }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="分类" width="300">
        <template #default="scope">
          <div style="display: flex; align-items: center">
            <el-icon><timer /></el-icon>
            <span>{{ categoryMap[scope.row.categoryId] }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="authorName" label="作者" width="300" />
      <el-table-column prop="readCount" label="阅读量" width="150" />
      <el-table-column prop="publishedAt" label="发布时间" width="200" />
      <el-table-column label="操作" width="240" fixed="right">
        <template #default="scope">
          <el-button type="primary" text>编辑</el-button>
          <el-button type="success" text v-if="scope.row.status === 0 || scope.row.status === 2"
            >发布</el-button
          >
          <el-button type="warning" text v-else>下线</el-button>
          <el-button type="danger" text>删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      layout="prev, pager, next"
      :total="pagination.total"
      :page-size="pagination.size"
      :current-page="pagination.currentPage"
      style="margin-top: 25px"
      @current-change="handleChange"
    ></el-pagination>
    <ArticleDialog v-model="dialogVisible" :categories="categories" />
  </div>
</template>
<script setup>
import PageHead from '@/components/PageHead.vue'
import TableSearch from '@/components/TableSearch.vue'
import ArticleDialog from '@/components/ArticleDialog.vue'
import { ref, reactive } from 'vue'
import { onMounted } from 'vue'
import { categoryTree, articlePage } from '@/api/admin'
const formItem = ref([
  {
    comp: 'input',
    prop: 'title',
    label: '文章标题',
    placeholder: '请输入文章标题'
  },
  {
    comp: 'select',
    prop: 'categoryId',
    label: '分类',
    placeholder: '请选择分类'
  },
  {
    comp: 'select',
    prop: 'status',
    label: '状态',
    placeholder: '请输入文章内容',
    options: [
      { label: '已发布', value: '0' },
      { label: '草稿', value: '1' },
      { label: '已下线', value: '2' }
    ]
  }
])

//向后端传参，初始参数 当前页第一页，每页数据大小以及总数
const pagination = reactive({
  currentPage: 1,
  size: 10,
  total: 0
})

// 列表数据
const tableData = ref([])

const handleSearch = async (formData) => {
  // console.log(formData, '查询参数')
  const params = {
    ...pagination,
    ...formData
  }
  const { records, total } = await articlePage(params)
  // console.log(data, '分页数据')
  tableData.value = records
  pagination.total = total
  console.log('表单数据', tableData.value)
}
//创建一个分类映射表
const categoryMap = reactive({})
const categories = ref([])

onMounted(async () => {
  const data = await categoryTree()
  // console.log(data, '分类数据')
  categories.value = data.map((item) => {
    categoryMap[item.id] = item.categoryName // 将分类数据映射到categoryMap中
    return {
      label: item.categoryName,
      value: item.id
    }
  })

  // 将分类数据映射到formItem[1].options中,即文章分类
  formItem.value[1].options = categories.value
  handleSearch()
})

const handleChange = (page) => {
  // console.log(val, '分页参数')
  pagination.currentPage = page
  handleSearch()
}

const dialogVisible = ref(false)
</script>
