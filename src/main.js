// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Meta from 'vue-meta'
import VueClipboard from 'vue-clipboard2'
import App from './App'
import store from './store'
import router from './router'
import VueLazyload from 'vue-lazyload'
import Firebase from 'firebase/app'
import 'firebase/messaging'

try {
  const config = {
    apiKey: 'AIzaSyDee_VkrRtByJCrCZAX3nTSDPl8AaHlWfY',
    authDomain: 'traq-r.firebaseapp.com',
    databaseURL: 'https://traq-r.firebaseio.com',
    projectId: 'traq-r',
    storageBucket: 'traq-r.appspot.com',
    messagingSenderId: '993645413001'
  }
  Firebase.initializeApp(config)
} catch (e) {
  console.log('failed initialize firebase', e)
}

Vue.config.productionTip = false

Vue.use(Meta)
Vue.use(VueClipboard)
Vue.use(VueLazyload)

window.asyncLoadComponents = component => {
  return () => {
    return component.then(data => {
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
