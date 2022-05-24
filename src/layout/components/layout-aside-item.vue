<template>
  <div>
    <div v-if="menu.children.length">
      <el-submenu :index="String(menu.menuid)">
        <template slot="title">
          <i :class="menu.icon"></i>
          <span>{{ menu.title }}</span>
        </template>
        <layout-aside-item 
          v-for="child in menu.children"
          :key="child.menuid"
          :menu="child"
        />
      </el-submenu>
    </div>
    <div v-else>
      <el-menu-item :index="menu.path">
        <i :class="menu.icon"></i>
        <span slot="title">{{ menu.title }}</span>
      </el-menu-item>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LayoutAsideItem',
  props: {
    menu: {
      type: Object,
      required: true,
    },
  },

  data() {
    return {}
  },
}
</script>

<style>
</style>