<template>
  <el-container class="layout">
    <el-aside width="200px">
      <layout-aside style="height: 100%"></layout-aside>
    </el-aside>
    <el-container>
      <el-header>
        <layout-header></layout-header>
      </el-header>
      <el-main>
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import LayoutAside from './components/layout-aside.vue'
import LayoutHeader from './components/layout-header.vue'

export default{
  name: 'Layout',
  components: {
    LayoutAside,
    LayoutHeader
  }
}
</script>

<style lang="scss">
.layout {
  min-height: 100vh;
  min-width: 980px;
}
.el-header {
  background-color: #fff;
}

</style>
