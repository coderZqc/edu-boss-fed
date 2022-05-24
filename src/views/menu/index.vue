<template>
  <div>
    <el-card class="box-card">
      <!-- Header -->
      <div slot="header" class="clearfix">
        <el-button type="primary" @click="$router.push({ name: 'menu-create' })"
          >添加菜单</el-button
        >
      </div>

      <!-- Data Table -->
      <el-table
        :data="menus"
        style="width: 100%"
        border
        default-expand-all
        row-key="menuid"
        :tree-props="{ children: 'children' }"
      >
        <el-table-column
          prop="title"
          label="名称"
          width="180"
        ></el-table-column>
        <el-table-column
          prop="menuid"
          label="编号"
          width="50"
          align="center"
        ></el-table-column>
        <el-table-column prop="icon" label="图标" width="180"></el-table-column>
        <el-table-column
          prop="path"
          label="路由"
          min-width="180"
        ></el-table-column>
        <el-table-column label="操作" min-width="180" align="center">
          <template slot-scope="scope">
            <el-button
              type="success"
              icon="el-icon-edit"
              size="mini"
              @click="
                $router.push({
                  name: 'menu-edit',
                  params: { id: scope.row.menuid },
                })
              "
              >编辑</el-button
            >
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="handleDelete(scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import * as menuApi from '@/api/menu'

export default {
  name: 'menu-list',
  data() {
    return {
      menus: [],
    }
  },
  async created() {
    const { data: menus } = await menuApi.getMenus()
    this.menus = menus
  },
}
</script>

<style>
</style>
