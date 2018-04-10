<template lang="pug">
div#app
  favicon
  splash(v-if="!$store.state.loaded || !$store.state.loadedComponent")
  router-view(v-else)
</template>

<script>
import Splash from '@/components/Splash/Splash'
import Favicon from '@/components/Util/Favicon'
export default {
  name: 'app',
  metaInfo: {
    title: 'Welcome',
    titleTemplate: '%s | traQ'
  },
  components: {
    Splash,
    Favicon
  },
  created () {
    console.log('REVISION:' + process.env.REVISION)
    if (process.env.NODE_ENV === 'production' && navigator.serviceWorker) {
      navigator.serviceWorker.register('/sw.js', {scope: '/'})
        .then(regisration => {
          console.log('Service Worker Registered!')
          regisration.update()
        })
    }
  }
}
</script>

<style lang="sass">
@import "~normalize.css"
@import url("//fonts.googleapis.com/earlyaccess/mplus1p.css")
@import url('https://fonts.googleapis.com/css?family=Oxygen+Mono')
@import "highlight.js/styles/default.css"
#app
  font-family: 'Mplus 1p','Avenir', Arial, sans-serif
  -webkit-font-smoothing: antialiased
  -moz-osx-font-smoothing: grayscale
  text-align: center
  color: #2c3e50
  margin-top: 60pxc
li
  list-style: none
  margin: 0
ul
  margin: 0
  padding: 0
p
  margin: 0
a
  text-decoration: none
code
  font-family: 'Oxygen Mono', monospace
  font-size: 0.9em
::selection
  color: white
  background-color: #3a4891
// input, button, textarea, select
.input-reset
  padding: 0
  background: none
  border: none
  border-radius: 0
  outline: none
  -webkit-appearance: none
  -moz-appearance: none
  appearance: none
.flex-center
  display: flex
  justify-content: center
  align-items: center
.sticky
  position: -webkit-sticky
  position: sticky
.sticky.sticky-fixed.is-sticky
  position: fixed
  -webkit-backface-visibility: hidden
  -moz-backface-visibility: hidden
  backface-visibility: hidden
.sticky.sticky-fixed.is-sticky:not([style*="margin-top"])
  margin-top: 0 !important
.sticky.sticky-fixed.is-sticky:not([style*="margin-bottom"])
  margin-bottom: 0 !important
.sticky.sticky-fixed.is-absolute
  position: absolute
</style>
