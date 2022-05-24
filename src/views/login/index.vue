<template>
  <el-form class="login" ref="form" :model="form" :rules="rules">
    <el-form-item label="账号：" prop="username">
      <el-input
        v-model="form.username"
        placeholder="请输入账号/手机号/邮箱"
      ></el-input>
    </el-form-item>
    <el-form-item label="密码：" prop="password">
      <el-input
        v-model="form.password"
        show-password
        placeholder="请输入密码"
      ></el-input>
    </el-form-item>
    <el-form-item>
      <el-button
        class="login__btn"
        type="primary"
        @click="onSubmit"
        :loading="loading"
      >
        登录
      </el-button>
    </el-form-item>
  </el-form>
</template>

<script>

export default {
  name: 'Login',
  data() {
    return {
      form: {
        username: 'admin',
        password: 'admin@123',
      },
      rules: {
        username: [{ required: true, message: '请输入账号', trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
      },
      loading: false,
    }
  },
  methods: {
    async onSubmit() {
      this.loading = true
      try {
        await this.$refs.form.validate()
      } catch (e) {
        // swallow validation error
        this.loading = false
        return console.log(e)
      }

      try {
        await this.$store.dispatch('user/login', this.form)
        this.$router.push(this.$route.query.redirect || '/')
        this.$message.success('登录成功')
      } catch (e) {
        if (e.error) {
          this.$message.error(e.error)
        }
      }
      this.loading = false
    },
  },
}
</script>

<style lang="scss" scoped>
.login {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  margin: auto;
  width: 300px;
  height: 250px;
  padding: 20px;
  border-radius: 5px;
  background-color: #fff;
  &__btn {
    width: 100%;
  }
}
</style>
