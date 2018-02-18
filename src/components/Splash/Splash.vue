<template lang="pug">
div.splash
  | {{text}}
  
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
      if (!this.$store.state.loaded) {
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
  background-color: rgba(0, 0, 0, 0.2)
  z-index: 1000
</style>
