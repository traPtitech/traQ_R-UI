// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import store from './store'
import router from './router'
import Icon from 'vue-awesome/components/Icon'
import 'vue-awesome/icons'

Vue.config.productionTip = false

Vue.component('icon', Icon)

window.asyncLoadComponents = component => {
  return () => {
    return component
      .then(data => {
        if (process.env.NODE_ENV) {
          console.log('w:async load component:', data.default.name)
        }
        store.commit('loadEndComponent')
        return data
      })
  }
}
Vue.component('modal', window.asyncLoadComponents(import('@/components/Util/Modal')))

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  template: '<App/>',
  components: { App }
})
