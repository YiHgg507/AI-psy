<template>
  <el-dialog :title="isEdit ? '编辑文章' : '新增文章'" v-model="localVisible" width="50%">
    <el-form ref="ruleFormRef" :model="formData" :rules="rules" label-width="90px">
      <el-form-item label="文章标题" prop="title">
        <!-- 文章标题 -->
        <el-input
          v-model="formData.title"
          placeholder="请输入文章标题"
          maxlength="200"
          show-word-limit
          clearable
        ></el-input>
      </el-form-item>
      <!-- 所属分类 -->
      <el-form-item label="所属分类" prop="categoryId">
        <el-select v-model="formData.categoryId" placeholder="请选择所属分类">
          <el-option
            v-for="category in categories"
            :key="category.value"
            :label="category.label"
            :value="category.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <!-- 文章摘要 -->
      <el-form-item label="文章摘要" prop="summary">
        <el-input
          v-model="formData.summary"
          maxlength="1000"
          placeholder="请输入文章摘要(可选)"
          show-word-limit
          type="textarea"
          :rows="4"
        />
      </el-form-item>
      <!-- 标签 -->
      <el-form-item label="标签" prop="tags">
        <el-select
          v-model="formData.tagArray"
          multiple
          placeholder="请输入文章标签(逗号分隔)"
          filterable
          allow-create
          style="width: 100%"
        >
          <el-option v-for="tags in commonTags" :key="tags" :label="tags" :value="tags"></el-option>
        </el-select>
      </el-form-item>
      <!-- 上传封面 -->
      <el-form-item label="封面图片">
        <div class="cover-upload">
          <el-upload
            class="avator-uploader"
            action="#"
            :before-upload="beforeUpload"
            :http-request="handleUploadRequest"
            accept="image/*"
            :show-file-list="false"
          >
            <div class="cover-placeholder" v-if="!imageUrl">
              <p>点击上传封面</p>
            </div>
            <img v-else :src="imageUrl" class="cover-img" />
            <div class="cover-remove" v-if="imageUrl">
              <!-- 阻止点击事件冒泡 -->
              <el-button
                type="danger"
                size="small"
                @click.stop="handleRemove"
                style="margin-left: 10px"
                >移除封面</el-button
              >
            </div>
          </el-upload>
        </div>
      </el-form-item>
      <!-- 富文本区域 -->
      <el-form-item label="文章内容" prop="content">
        <RichTextEditor
          v-model="formData.content"
          placeholder="请输入文章内容,支持富文本格式\n\n可以使用加粗、斜体、列表、标题等格式来丰富文章内容"
          :maxCharCount="5000"
          @change="handleContentChange"
          @created="handleEditorCreated"
          min-height="300px"
        />
      </el-form-item>
    </el-form>
    <!-- 内容预览 -->
    <div v-if="btnPreview">
      <h3>内容预览</h3>
      <div v-html="formData.content"></div>
    </div>
    <template #footer>
      <el-button @click="btnPreview = !btnPreview">{{
        btnPreview ? '隐藏预览' : '预览效果'
      }}</el-button>
      <el-button type="primary" @click="handleClose">关闭</el-button>
      <el-button type="primary" @click="handleSubmit" :loading="loading">{{
        isEdit ? '更新文章' : '创建文章'
      }}</el-button>
    </template>
  </el-dialog>
</template>
<script setup>
// formData是用户新上传的表单数据

import { ElMessage } from 'element-plus'
import { reactive, ref, computed, nextTick, watch } from 'vue'
import { uploadFile, submitFile, updateArticle } from '../api/admin'
import { fileBaseUrl } from '@/config'
import RichTextEditor from './RichTextEditor.vue'

// 组件数据传输
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  categories: {
    type: Array,
    default: () => []
  },
  article: {
    type: Object,
    default: null
  }
})
const emits = defineEmits(['update:modelValue', 'success'])

// 弹窗控制
const localVisible = computed({
  get() {
    return props.modelValue
  },
  set(val) {
    emits('update:modelValue', val)
  }
})
// 表单部分
const ruleFormRef = ref()
const formData = reactive({
  categoryId: '',
  content: '',
  coverImage: '',
  id: '',
  summary: '',
  tags: '',
  title: '',
  tagArray: [] // 多选标签用的数组
})
const rules = reactive({
  title: [
    { required: true, message: '请输入文章标题', trigger: 'blur' },
    { max: 200, message: '文章标题最多200字符', trigger: 'blur' }
  ],
  categoryId: [{ required: true, message: '请选择文章分类', trigger: 'blur' }],
  content: [
    { required: true, message: '请输入文章内容', trigger: 'blur' },
    { max: 2000, message: '文章内容最多5000字符', trigger: 'blur' }
  ]
})

const commonTags = [
  '情绪管理',
  '焦虑',
  '抑郁',
  '压力',
  '睡眠',

  '冥想',
  '正念',
  '放松',
  '心理健康',
  '自我成长',

  '人际关系',
  '工作压力',
  '学习方法',
  '生活技巧'
]

// 上传图片
const imageUrl = ref('')
const beforeUpload = (file) => {
  const isImage = file.type.startsWith('image/')
  const isLt5M = file.size / 1024 / 1024 < 5
  if (!isImage) {
    ElMessage.error('请上传图片文件')
    return false
  }
  if (!isLt5M) {
    ElMessage.error('上传图片大小不能超过5M')
    return false
  }
  return true
}

// bussinesssId唯一值ID
const bussinessId = ref(null)
const handleUploadRequest = async ({ file }) => {
  //UUID
  bussinessId.value = crypto.randomUUID()
  // console.log(bussinessId)
  const fileRes = await uploadFile(file, { bussinessId: bussinessId.value })
  console.log(fileRes)
  // 拼接完整图片地址
  imageUrl.value = fileBaseUrl + fileRes.filePath
  formData.coverImage = fileRes.filePath
  console.log(imageUrl.value)
}

const handleRemove = () => {
  imageUrl.value = ''
  formData.coverImage = ''
}

// 富文本
const editorInstance = ref(null)
const handleContentChange = (data) => {
  // console.log(data, '富文本内容')
  // 返回html和text
  formData.content = data.html
}
const handleEditorCreated = (editor) => {
  editorInstance.value = editor
  // 编辑
  if (formData.content && editor) {
    nextTick(() => {
      editor.setHtml(formData.content)
    })
  }
}

// 内容预览
const btnPreview = ref(false)
const loading = ref(false)
// footer按钮部分
const handleClose = () => {
  ruleFormRef.value.resetFields()
  bussinessId.value = null
  formData.tagArray = []
  handleRemove()
  emits('update:modelValue', false)
}
const handleSubmit = () => {
  ruleFormRef.value.validate((valid) => {
    if (valid) {
      loading.value = true
    }
    // console.log(formData, '表单数据')
    const submitData = {
      ...formData,
      tags: formData.tagArray.join(',')
    }
    delete submitData.tagArray
    // 新增
    if (!isEdit.value) {
      submitData.id = bussinessId.value
      submitFile(submitData).then(() => {
        loading.value = false
        emits('success')
      })
    } else {
      // 编辑（更新）
      updateArticle(props.article.id, submitData).then((res) => {
        console.log(res)
        loading.value = false
        emits('success')
      })
    }
  })
}

// 判断是编辑还是新增
// const isEdit = computed(() => props.article && props.article.id)
const isEdit = computed(() => !!props.article?.id)

// 监听编辑数据
watch(
  () => props.article,
  (newVal) => {
    nextTick(() => {
      if (newVal) {
        // 修改对象内部的属性，对象还是那个被 Proxy 包裹的对象
        // 直接赋值相当于建立新对象，响应式丢失
        Object.assign(formData, newVal)
        bussinessId.value = newVal.id
        imageUrl.value = fileBaseUrl + newVal.coverImage
      }
    })
    // else {
    //   Object.assign(formData, {
    //     categoryId: '',
    //     content: '',
    //     coverImage: '',
    //     id: '',
    //     summary: '',
    //     tags: '',
    //     title: '',
    //     tagArray: []
    //   })
    //   imageUrl.value = ''
    //   bussinessId.value = ''
    // }
  }
)
</script>
<style lang="scss" scoped>
.cover-placeholder {
  width: 200px;
  height: 120px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #8b949e;
  background-color: #f6f8fa;
}
.cover-img {
  width: 200px;
  height: 120px;
  display: block;
}
</style>
