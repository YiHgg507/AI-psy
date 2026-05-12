<template>
  <!-- :model获取表单内的数据 -->
  <el-form :model="formData" ref="ruleFormRef">
    <el-row :gutter="24">
      <template v-for="item in formItemArrs" :key="item.prop">
        <el-col v-bind="item.col">
          <el-form-item :label="item.label" :prop="item.prop">
            <!-- v-model实现双向绑定 -->
            <component
              :is="isComp(item.comp)"
              v-model="formData[item.prop]"
              :placeholder="item.placeholder"
            >
              <template v-if="item.comp === 'select'">
                <el-option label="全部" value="all"></el-option>
                <el-option
                  v-for="opt in item.options"
                  :key="opt.value"
                  :value="opt.value"
                  :label="opt.label"
                ></el-option>
              </template>
            </component>
          </el-form-item>
        </el-col>
      </template>
      <el-col :span="24">
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="handleReset(ruleFormRef)">重置</el-button>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>
<script setup>
import { reactive, computed, ref } from 'vue'

const props = defineProps({
  formItem: {
    type: Array,
    default: () => []
  }
})
const ruleFormRef = ref(null)

const emit = defineEmits(['search'])

const formData = reactive({})
// select 字段设默认值 "all"，匹配"全部"选项
props.formItem.forEach((item) => {
  if (item.comp === 'select') {
    formData[item.prop] = 'all'
  }
})
//增加列宽
const formItemArrs = computed(() => {
  return props.formItem.map((item) => ({
    ...item,
    col: { xs: 24, sm: 12, md: 8, lg: 6, xl: 6 }
  }))
})

// 判断表单类型
const isComp = (comp) => {
  return {
    input: 'el-input',
    select: 'el-select'
  }[comp]
}
//查询表单
const handleSearch = () => {
  console.log('表单数据：', formData)
  // 传递formData数据
  emit('search', formData)
}

// 重置表单
const handleReset = (formEl) => {
  if (!formEl) return
  formEl.resetFields()
  emit('search', formData)
}
</script>
