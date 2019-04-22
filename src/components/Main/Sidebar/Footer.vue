<template lang="pug">
.footer
  span.version-text
    | traQ R {{ version }}
  ul.footer-button-wrap
    li.menu-button(@click.prevent="$store.dispatch('openTourModal')")
      IconHelp
    li.menu-button.theme(@click="changeTheme")
      IconCrescent(v-if="theme === 'light'")
      IconCrescentFill(v-else)
    li.menu-button.setting(@click="$router.push('/setting')")
      IconGear(size="16")
</template>

<script>
import version from '@/version'
import IconGear from '@/components/Icon/IconGear'
import IconCrescent from '@/components/Icon/IconCrescent'
import IconCrescentFill from '@/components/Icon/IconCrescentFill'
import IconHelp from '@/components/Icon/IconHelp'

export default {
  components: {
    IconGear,
    IconCrescent,
    IconCrescentFill,
    IconHelp
  },
  methods: {
    changeTheme() {
      if (this.theme === 'light') {
        this.$store.dispatch('updateTheme', 'dark')
      } else {
        this.$store.dispatch('updateTheme', 'light')
      }
    }
  },
  computed: {
    theme() {
      return this.$store.state.theme
    },
    version() {
      return version
    }
  }
}
</script>

<style lang="sass">
.footer
  position: relative
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
  cursor: pointer
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
