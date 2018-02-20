<template lang="pug">
div#app
  router-view
</template>

<script>
export default {
  name: 'app',
  metaInfo: {
    title: 'Welcome',
    titleTemplate: '%s | traQ'
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
