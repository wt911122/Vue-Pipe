import Vue from 'vue'
import vuePipe from 'vue-pipe';
Vue.use(vuePipe)
import App from './App.vue'
// import router from './router'

Vue.config.productionTip = false

new Vue({
  render: function (h) { return h(App) }
}).$mount('#app')
