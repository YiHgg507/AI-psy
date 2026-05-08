<template>
  <div class="page-head">
    <p class="page-title">{{ prors.title }}</p>
    <div class="action-btn">
      <slot name="buttons"></slot>
    </div>
  </div>
</template>
<script setup>
const prors = defineProps({
  title: {
    type: String,
    default: '页面标题'
  }
})
</script>
<style scoped lang="scss">
.page-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  .page-title {
    font-size: 24px;
    font-weight: 400;
  }
}
</style>
