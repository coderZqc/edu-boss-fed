<template>
  <el-menu
    default-active="2"
    class="el-menu-vertical-demo"
    background-color="#545c64"
    text-color="#fff"
    active-text-color="#ffd04b"
    router
  >
    <layout-aside-item 
      v-for="m in menus"
      :key="m.menuid"
      :menu="m"
    >
    </layout-aside-item>

  </el-menu>
</template>

<script>
import LayoutAsideItem from './layout-aside-item.vue'
import { mapGetters } from 'vuex'

export default {
  name: 'LayoutAside',
  components: {
    LayoutAsideItem
  },
  data() {
    return {
      
    }
  },
  computed: {
    ...mapGetters(['menus'])
  },
  methods: {
  },
}
</script>

<style lang="scss" scoped>
.el-menu {
  border: none;
}
</style>
