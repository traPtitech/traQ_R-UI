// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import Modal from '@/components/Util/Modal'
import store from './store'
import router from './router'

Vue.config.productionTip = false

Vue.component('modal', Modal)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  template: '<App/>',
  components: { App }
})
