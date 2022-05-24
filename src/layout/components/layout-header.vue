<template>
  <div class="layout-header">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item><a href="/">活动管理</a></el-breadcrumb-item>
      <el-breadcrumb-item>活动列表</el-breadcrumb-item>
      <el-breadcrumb-item>活动详情</el-breadcrumb-item>
    </el-breadcrumb>
    <el-dropdown>
      <span class="el-dropdown-link">
        <el-avatar
          :size="40"
          shape="square"
          :src="
            avatar ||
            'https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png'
          "
        ></el-avatar>
      </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item>{{ username }}</el-dropdown-item>
        <el-dropdown-item divided @click.native="logout">退出</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>

<script>
import Vue from 'vue'
import { mapGetters } from 'vuex'

export default Vue.extend({
  name: 'LayoutHeader',
  data() {
    return {
    }
  },
  methods: {
    async logout() {
      await this.$store.dispatch('user/logout')
      this.$router.push({ name: 'login' })
    },
  },
  computed: {
    ...mapGetters(['username', 'avatar'])
  }
})
</script>

<style lang="scss" scoped>
.layout-header {
  display: flex;
  height: 100%;
  align-items: center;
  justify-content: space-between;
  .el-dropdown-link {
    cursor: pointer;
  }
}
</style>
