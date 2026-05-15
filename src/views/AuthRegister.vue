<template>
  <div class="container">
    <div class="title">
      <div class="title-text">
        <h2>创建您的账户</h2>
        <p>请填写注册信息</p>
      </div>
    </div>
    <div class="form-container">
      <el-form :model="formData" ref="formRef" :rules="rules" label-position="top">
        <el-form-item label="用户名或邮箱" prop="username">
          <el-input
            v-model="formData.username"
            placeholder="请输入用户名或邮箱"
            size="large"
          ></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="formData.email" placeholder="请输入邮箱" size="large"></el-input>
        </el-form-item>
        <el-form-item label="昵称" prop="nickname">
          <el-input
            v-model="formData.nickname"
            placeholder="请输入昵称（可选）"
            size="large"
          ></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input
            v-model="formData.phone"
            placeholder="请输入手机号（可选）"
            size="large"
          ></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input
            v-model="formData.password"
            placeholder="请输入密码"
            type="password"
            show-password
            size="large"
          ></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input
            v-model="formData.confirmPassword"
            placeholder="请再次输入密码"
            show-password
            size="large"
          ></el-input>
        </el-form-item>
      </el-form>
      <el-button type="primary" @click="submitForm(formRef)" class="btn">创建账户</el-button>
      <p>已有账户？<router-link to="/auth/login">立即登录</router-link></p>
    </div>
  </div>
</template>
<script setup>
import { ref, reactive } from 'vue'
import { userRegister } from '../api/frontend.js'
import { ElMessageBox } from 'element-plus'
import { useRouter } from 'vue-router'
const formData = reactive({
  username: '',
  email: '',
  nickname: '',
  phone: '',
  password: '',
  confirmPassword: '',
  gender: 1,
  userType: 1
})
const formRef = ref(null)
const rules = reactive({
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' }
    // { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱地址', trigger: 'blur' }
    // { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请再次输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
  ]
})

const router = useRouter()
const submitForm = (formEl) => {
  if (!formEl) return
  formEl.validate((valid) => {
    if (valid) {
      userRegister(formData).then((res) => {
        if (res.code === 200) {
          ElMessageBox.alert(res.msg || '注册成功', '注册成功', {
            type: 'success',
            callback: () => router.push('/auth/login')
          })
        } else {
          ElMessageBox.alert(res.msg || res.message || '注册失败，请稍后重试', '注册失败', {
            type: 'error',
            confirmButtonText: '确定'
          })
        }
      })
    }
  })
}
</script>

<style scoped lang="scss">
.container {
  width: 384px;
  .flex-box {
    display: flex;
    align-items: center;
  }
  .title {
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
      margin-top: 20px;
      width: 100%;
    }
    .footer {
      padding: 30px;
      text-align: center;
    }
  }
}
</style>
