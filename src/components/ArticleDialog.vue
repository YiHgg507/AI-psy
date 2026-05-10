<template>
  <el-dialog title="编辑文章" v-model="localVisible" width="50%">
    <el-form ref="ruleFormRef" :model="formData" :rules="rules">
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
            v-for="item in props.categories"
            :key="item.value"
            :label="item.label"
            :value="item.value"
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
    </el-form>
  </el-dialog>
</template>
<script setup>
import { reactive, ref, computed } from 'vue'
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  categories: {
    type: Array,
    default: () => []
  }
})
const emits = defineEmits(['update:modelValue'])
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
  categoryId: 1,
  content: '',
  coverImage: '',
  id: '',
  summary: '',
  tags: '',
  title: ''
})
const rules = reactive({
  title: [
    { required: true, message: '请输入文章标题', trigger: 'blur' },
    { max: 200, message: '文章标题最多200字符', trigger: 'blur' }
  ],
  categoryId: [{ required: true, message: '请选择文章分类', trigger: 'blur' }]
})
</script>
