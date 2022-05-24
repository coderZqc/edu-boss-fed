import Vue from 'vue'
import App from './App.vue'
import store from './store'
import router from './router'
import ElementUI from 'element-ui'
// import './mock'

// 加载全局样式
import './styles/index.scss'

Vue.config.productionTip = false
Vue.use(ElementUI)

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')

