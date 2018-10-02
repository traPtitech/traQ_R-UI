<template lang="pug">
div.splash
</template>

<script>
export default {
  name: 'Splash',
  data () {
    return {
      text: 'ローディング中！！！'
    }
  },
  created () {
    this.addText()
  },
  methods: {
    addText () {
      if (!this.$store.state.loaded || !this.$store.state.loadedComponent) {
        this.text = this.text + '\nローディング中！'
        setTimeout(this.addText, 100)
      }
    }
  }
}
</script>

<style lang="sass">
.splash
  display: fix
  width: 100vw
  height: 100vh
  background-color: #6cb8ff
  z-index: 1000
  animation: gradationTest 3s infinite
@keyframes gradationTest 
  0% {background-color: #6cb8ff;}
  50% {background-color: #fff66c;}
  100% {background-color: #ffa36c;}
</style>
