// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Meta from 'vue-meta'
import VueClipboard from 'vue-clipboard2'
import App from './App'
import store from './store'
import router from './router'

Vue.config.productionTip = false

Vue.use(Meta)
Vue.use(VueClipboard)

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

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  template: '<App/>',
  components: { App }
})
