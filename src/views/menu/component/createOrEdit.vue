<template>
  <el-card class="box-card">
    <!-- Header -->
    <div slot="header" class="clearfix">
      {{ isEdit ? '编辑菜单' : '添加菜单' }}
    </div>

    <!-- Data Form -->
    <el-form ref="form" :model="form" :rules="rules" label-width="80px">
      <el-form-item label="菜单名称" prop="title" placeholder="请输入菜单名称">
        <el-input v-model="form.title"></el-input>
      </el-form-item>
      <el-form-item label="菜单路由" prop="path">
        <el-select v-model="form.path">
          <el-option :key="-1" label="无路由（父菜单）" value=""></el-option>
          <el-option
            v-for="r in routeList"
            :key="r.routeid"
            :label="r.path"
            :value="r.path"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="上级菜单" prop="pid">
        <el-select v-model="form.pid">
          <el-option :key="-1" label="菜单根节点" :value="-1"></el-option>
          <el-option
            v-for="m in menuList"
            :key="m.menuid"
            :label="m.title"
            :value="m.menuid"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="菜单图标">
        <el-input v-model="form.icon"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">{{
          isEdit ? '确定' : '添加'
        }}</el-button>
        <el-button @click="$router.push({ name: 'menu' })">{{
          isEdit ? '返回' : '取消'
        }}</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
import * as menuApi from '@/api/menu'
import * as routeApi from '@/api/route'

export default {
  name: 'CreateOrEdit',
  props: {
    isEdit: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    const notNull = (message) => {
      return (rule, value, callback) => {
        if (value === null) {
          return callback(new Error(message))
        }
        callback()
      }
    }
    const notBlank = (message) => {
      return (rule, value, callback) => {
        if (!value) {
          return callback(new Error(message))
        }
        if (value instanceof String && value.trim() === '') {
          return callback(new Error(message))
        }
        callback()
      }
    }
    return {
      form: {
        title: '',
        path: null,
        pid: null,
        icon: '',
      },
      routeList: [],
      menuList: [],
      rules: {
        title: [{ validator: notBlank('请输入菜单名称'), trigger: 'blur' }],
        path: [{ validator: notNull('请选择菜单路由'), trigger: 'change' }],
        pid: [{ validator: notNull('请选择上级菜单'), trigger: 'change' }],
      },
    }
  },
  created() {
    this.fetchRoutes()
    this.fetchMenus()
    this.fetchMenuByIdIfEdit()
  },
  methods: {
    /**
     * 请求路由列表（森林），并筛选出所有路由树中的叶子节点，构成线性表
     */
    async fetchRoutes() {
      const { data: routes } = await routeApi.getRoutes()
      const flatList = []
      const queue = [].concat(routes)
      while (queue.length) {
        const cur = queue.shift()
        // 筛选森林中的叶子节点
        if (cur.children.length) {
          queue.push(...cur.children)
        } else {
          flatList.push(cur)
        }
      }
      this.routeList = flatList
    },

    /**
     * 请求菜单列表（森林），遍历森林并将其存入线性表
     */
    async fetchMenus() {
      const { data: menus } = await menuApi.getMenus()

      // bfs 遍历森林
      const flatList = []
      const queue = [].concat(menus)
      while (queue.length) {
        const cur = queue.shift()
        flatList.push(cur)
        // 如果是编辑页面，那么当前菜单可选的上级菜单就不能包括当前菜单的子菜单，
        // 否则森林可能成为带有环的图。因此，在遍历的过程中剔除当前菜单的子菜单。
        if (this.isEdit && this.$route.params.id === cur.menuid) {
          cur.children = []
        }
        queue.push(...cur.children)
      }
      this.menuList = flatList
    },

    async fetchMenuByIdIfEdit() {
      if (this.isEdit) {
        const menuid = this.$route.params.id
        const { data: menu } = await menuApi.getMenuById(menuid)
        this.form = menu
      }
    },
    async onSubmit() {
      try {
        await this.$refs.form.validate()
        console.log('submit!')
      } catch (e) {
        console.log(e)
      }
    },
  },
}
</script>

<style>
</style>