<template lang="pug">
div.footer
  span.version-text
    | traQ R alpha
  ul.footer-button-wrap
    li.menu-button.theme(@click="changeTheme")
      icon(:name="themeIconName")
    li.menu-button.setting(@click="$router.push('/setting')")
      icon(name="cog")
</template>

<script>
export default {
  methods: {
    changeTheme () {
      if (this.theme === 'light') {
        this.$store.dispatch('updateTheme', 'dark')
      } else {
        this.$store.dispatch('updateTheme', 'light')
      }
    }
  },
  computed: {
    theme () {
      return this.$store.state.theme
    },
    themeIconName () {
      return this.theme === 'light' ? 'regular/moon' : 'moon'
    }
  }
}
</script>

<style lang="sass">
.footer
  height: $footer-height
  width: 100%
  background: $secondary-color
  display: flex
  align-items: center
  justify-content: space-between
.footer-button-wrap
  margin: 0 20px
  display: flex

.menu-button
  margin-left: 1rem
  color: white

@supports not (--primary-color: #232C26)
  .menu-button.theme
    display: none

.version-text
  color: white
  font-size: 15px
  margin-left: 20px
</style>
