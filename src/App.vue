<template lang="pug">
div#app
  splash(v-if="!$store.state.loaded")
  router-view(v-else)
</template>

<script>
import Splash from '@/components/Splash/Splash'
export default {
  name: 'app',
  metaInfo: {
    title: 'Welcome',
    titleTemplate: '%s | traQ'
  },
  components: {
    Splash
  }
}
</script>

<style lang="sass">
#app
  font-family: 'Avenir', Helvetica, Arial, sans-serif
  -webkit-font-smoothing: antialiased
  -moz-osx-font-smoothing: grayscale
  text-align: center
  color: #2c3e50
  margin-top: 60pxc
body
  margin: 0
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
</style>
