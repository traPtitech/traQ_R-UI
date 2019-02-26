<template lang="pug">
  div.splash.flex-center
    icon-logo(:size="100")
</template>

<script>
import IconLogo from '@/components/Icon/IconLogo'

export default {
  name: 'Splash',
  components: {IconLogo}
}
</script>

<style lang="sass">
.splash
  position: fixed
  top: 0
  right: 0
  width: 100%
  height: 100%
  background-color: #0D67EA
  background-color: var(--primary-color)
  z-index: 1000000
  animation: logo-fade-in .4s ease
  transition: background-color .6s ease

@keyframes logo-fade-in
  from
    opacity: 0
  to
    opacity: 1
</style>
