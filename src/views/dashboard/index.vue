<template>
  <div class="dashboard-container">
    <div style="margin: 20px 0">
      <el-button type="primary" plain>开始轮询</el-button>
      <el-button type="success" plain>结束轮询</el-button>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Dashboard',
  computed: {
    ...mapGetters([
      'name'
    ])
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }

  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
