<template lang="pug">
  div.splash.flex-center
    icon-logo(:size="100")
</template>

<script>
import IconLogo from '@/components/Icon/IconLogo'

export default {
  name: 'Splash',
  components: {IconLogo},
  created () {
  },
  methods: {
  }
}
</script>

<style lang="sass">
.splash
  display: fixed
  width: 100vw
  height: 100vh
  background: var(--primary-color)
  z-index: 1000
  animation: logo-fade-in .4s ease

@keyframes logo-fade-in
  from
    opacity: 0
  to
    opacity: 1
</style>
