<template>
  <div>
    <PageHead title="知识文章">
      <template #buttons>
        <el-button type="primary" @click="handleCreate">新增</el-button>
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
      <el-table-column prop="updatedAt" label="发布时间" width="200" />
      <el-table-column label="操作" width="240" fixed="right">
        <template #default="scope">
          <el-button type="primary" text @click="handleEdit(scope.row)">编辑</el-button>
          <el-button
            type="success"
            text
            @click="handlePublish(scope.row)"
            v-if="scope.row.status === 0 || scope.row.status === 2"
            >发布</el-button
          >
          <el-button type="warning" text @click="handleUnPublish(scope.row)" v-else>下线</el-button>
          <el-button type="danger" text @click="handleDelete(scope.row)">删除</el-button>
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
    <ArticleDialog
      v-model="dialogVisible"
      :categories="categories"
      @success="handleSuccess"
      :article="currentArticle"
    />
  </div>
</template>
<script setup>
// currentAritcle是通过当前接口调用的已经填入后端的数据
// 传入弹窗子元素叫article

import PageHead from '@/components/PageHead.vue'
import TableSearch from '@/components/TableSearch.vue'
import ArticleDialog from '@/components/ArticleDialog.vue'
import { ref, reactive } from 'vue'
import { onMounted } from 'vue'
import {
  categoryTree,
  articlePage,
  getArticleDetail,
  changeArticleStatus,
  deleteArticle
} from '@/api/admin'
import { ElMessageBox, ElMessage } from 'element-plus'
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

// 弹窗显示
const dialogVisible = ref(false)
const handleSuccess = () => {
  dialogVisible.value = false
  handleSearch()
}

// 编辑数据
const currentArticle = ref(null)

const handleCreate = () => {
  //新增
  dialogVisible.value = true
  currentArticle.value = null
}
const handleEdit = async (row) => {
  // console.log(row, '编辑参数')
  // 编辑
  const res = await getArticleDetail(row.id)
  console.log(res, '编辑数据')
  currentArticle.value = res
  dialogVisible.value = true
}

// 发布
const handlePublish = (row) => {
  ElMessageBox.confirm(`确认发布文章${row.title}吗？`, '确认', {
    confirmButtonText: '确认发布',
    cancelButtonText: '取消',
    type: 'info'
  }).then(() => {
    changeArticleStatus(row.id, { status: 1 }).then(() => {
      ElMessage.success('发布成功')
      handleSearch()
    })
  })
}
// 下线
const handleUnPublish = (row) => {
  ElMessageBox.confirm(`确认下线文章${row.title}吗？`, '确认', {
    confirmButtonText: '确认下线',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    changeArticleStatus(row.id, { status: 2 }).then(() => {
      ElMessage.success('下线成功')
      handleSearch()
    })
  })
}

// 删除
const handleDelete = (row) => {
  ElMessageBox.confirm(`确认删除文章${row.title}吗？`, '确认', {
    confirmButtonText: '确认删除',
    cancelButtonText: '取消',
    type: 'danger'
  }).then(() => {
    deleteArticle(row.id).then(() => {
      ElMessage.success('删除成功')
      handleSearch()
    })
  })
}
</script>
