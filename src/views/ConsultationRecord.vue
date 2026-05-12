<template>
  <div>
    <PageHead title="咨询记录" />
    <el-table :data="tableData">
      <el-table-column label="会话ID" width="120px">
        <template #default="scope">
          <el-avatar>{{ scope.row.userNickname }}</el-avatar>
        </template>
      </el-table-column>
      <el-table-column label="情绪日志">
        <template #default="scope">
          <div class="session-title">{{ scope.row.sessionTitle }}</div>
          <div class="session-preview">{{ scope.row.lastMessageContent }}</div>
        </template>
      </el-table-column>
      <el-table-column label="消息数" prop="messageCount" width="100px" />
      <el-table-column label="时间" prop="startedAt" width="150px" />
      <el-table-column label="操作" width="100px">
        <template #default="scope">
          <el-button type="primary" @click="viewSessionDetails(scope.row)" text>详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      style="margin-top: 25px"
      layout="prev, pager, next"
      :total="pagination.total"
      :page-size="pagination.size"
      v-model:current-page="pagination.currentPage"
    ></el-pagination>
    <el-dialog
      title="咨询会话详情"
      width="70%"
      v-model="showDetailDialog"
      :close-on-click-modal="false"
    >
      <div class="session-detail">
        <div class="detail-header">
          <div class="detail-row">
            <div class="detail-label">用户：</div>
            <div class="detail-value">{{ detailHeaderData.userNickname }}</div>
          </div>
          <div class="detail-row">
            <div class="detail-label">开始时间：</div>
            <div class="detail-value">{{ detailHeaderData.startedAt }}</div>
          </div>
          <div class="detail-row">
            <div class="detail-label">消息数：</div>
            <div class="detail-value">{{ detailHeaderData.messageCount }}</div>
          </div>
        </div>
        <div class="messages-container">
          <div class="messages-header">
            <h4>对话记录</h4>
          </div>
          <div class="messages-list" v-loading="messageLoading">
            <div
              class="message-item"
              v-for="message in SessionDetail"
              :key="message.Id"
              :class="message.senderType === 1 ? 'user-message' : 'ai-message'"
            >
              <div class="message-header">
                <span class="sender">{{ message.senderTypeDesc }}</span>
                <span class="time">{{ message.createdAt }}</span>
              </div>
              <div class="message-content">{{ message.content }}</div>
            </div>
          </div>
        </div>
      </div>
      <template #footer>
        <div style="text-align: right">
          <el-button @click="showDetailDialog = false">关闭</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>
<script setup>
import PageHead from '@/components/PageHead.vue'
import { getSessionChat, getSessionDetail } from '@/api/admin'
import { ref, reactive, onMounted, watch } from 'vue'

// 获取数据和分页信息
const tableData = ref([])

const pagination = reactive({
  currentPage: 1,
  size: 10,
  total: 0
})

const tableLoading = ref(false)
const handleGetData = async () => {
  tableLoading.value = true
  const { records, total } = await getSessionChat(pagination)
  // console.log(records)
  tableLoading.value = false
  tableData.value = records
  pagination.total = total
}
// 请求咨询记录数据 包含recoreds详细数据 total总条数
onMounted(async () => {
  handleGetData()
})

// 分页逻辑 监听，页面发生变化时重新请求数据
watch(
  () => pagination.currentPage,
  () => {
    handleGetData()
  }
)

// 对话详情
const showDetailDialog = ref(false)

// 头部数据从当前行数据获取
const detailHeaderData = ref({})
// 会话详细数据从接口获取
const SessionDetail = ref({})
// 加载loading动画
const messageLoading = ref(false)
// 直接通过当前行的数据获取简单的用户、时间、消息信息
const viewSessionDetails = async (row) => {
  messageLoading.value = true
  showDetailDialog.value = true
  SessionDetail.value = await getSessionDetail(row.id)
  messageLoading.value = false
  console.log(SessionDetail.value)
  detailHeaderData.value = row
  // console.log(row)
}
</script>
<style scoped lang="scss">
.session-title {
  font-weight: 500;
  color: #333;
  margin-bottom: 4px;
}
.session-preview {
  font-size: 13px;
  color: #666;
  margin-bottom: 4px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.session-detail {
  max-height: 70vh;
  overflow-y: auto;
  .detail-header {
    margin-bottom: 20px;
    padding: 16px;
    background: #f8f9fa;
    border-radius: 8px;
    border: 1px solid #e9ecef;
  }

  .detail-row {
    display: flex;
    align-items: center;
    margin-bottom: 8px;
    :last-child {
      margin-bottom: 0;
    }
    .detail-label {
      font-weight: 500;
      color: #495057;
      min-width: 80px;
      margin-right: 8px;
    }

    .detail-value {
      color: #333;
    }
  }
}
.messages-container {
  margin-top: 20px;
  .messages-header {
    margin-bottom: 16px;
    h4 {
      margin: 0;
      color: #333;
      font-size: 16px;
      font-weight: 500;
    }
  }
  .messages-list {
    max-height: 400px;
    overflow-y: auto;
    border: 1px solid #e9ecef;
    border-radius: 8px;
    padding: 16px;
    background: #fff;
    .message-item {
      margin-bottom: 12px;
      padding: 12px;
      border-radius: 8px;
      background: #f8f9fa;
      border: 1px solid #e9ecef;
      :last-child {
        margin-bottom: 0;
      }
      &.user-message {
        background: #e8f4fd;
      }

      &.ai-message {
        background: #f0f9f0;
      }
    }
    .message-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
      .sender {
        font-weight: 500;
        color: #333;
      }

      .time {
        font-size: 12px;
        color: #999;
      }
    }
    .message-content {
      color: #333;
      line-height: 1.6;
      white-space: pre-wrap;
      margin-top: 8px;
      font-size: 14px;
    }
  }
}
</style>
