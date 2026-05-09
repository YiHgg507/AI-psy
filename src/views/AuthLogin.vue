<template>
  <div class="container">
    <div class="title">
      <div class="back-home">
        <el-icon><Back /></el-icon>
        <span>返回首页</span>
      </div>
      <div class="title-text">
        <h2>登录您的帐户</h2>
        <p>请输入您的登录信息</p>
      </div>
    </div>
    <div class="form-container">
      <el-form ref="RuleFormRef" :model="formData" :rules="rules" label-position="top">
        <el-form-item label="用户名或邮箱" size="large" prop="username">
          <el-input v-model="formData.username" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item label="密码" size="large" prop="password">
          <el-input
            v-model="formData.password"
            placeholder="请输入密码"
            type="password"
            show-password
          ></el-input>
        </el-form-item>
        <el-button class="btn" type="primary" size="large" @click="submitForm(RuleFormRef)"
          >登录</el-button
        >
      </el-form>
      <div class="footer">
        <p>还没有账户？<router-link to="/auth/register">去注册</router-link></p>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, reactive } from 'vue'
const formData = reactive({
  username: '',
  password: ''
})
const rules = reactive({
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
})

const RuleFormRef = ref(null)
const submitForm = (formEl) => {
  if (!formEl) return
  formEl.validate((valid) => {
    if (valid) {
      console.log('submit!')
    } else {
      console.log('error submit!')
    }
  })
}
</script>
<style lang="scss" scoped>
.container {
  width: 384px;
  .title {
    .back-home {
      margin-bottom: 30px;
    }
    .title-text {
      text-align: center;
      h2 {
        font-size: 36px;
        margin-bottom: 10px;
      }
      p {
        font-size: 18px;
        color: #6b7280;
      }
    }
  }
  .form-container {
    margin-top: 30px;
    .btn {
      width: 100%;
      margin-top: 30px;
    }
    .footer {
      padding: 30px;
      text-align: center;
    }
  }
}
</style>
