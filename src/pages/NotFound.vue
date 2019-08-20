<template lang="pug">
  .not-found
    .not-found-message-container
      icon-logo(size="88" color="var(--primary-color)")
      h1.not-found-message-title 404 / Not Found
      .not-found-message
        | {{ $route.path }} はtraQに存在しないようです。
      router-link(to="/").not-found-link
        | traQに戻る

</template>

<script>
import IconLogo from '@/components/Icon/IconLogo'

export default {
  name: 'NotFound',
  components: {
    IconLogo
  }
}
</script>

<style lang="sass">
.not-found
  display: flex
  align-items: center
  width: 100vw
  height: 100vh
  padding:
    right: 10%
    top:
    left: 10%
    bottom: 10%

.not-found-message-title
  font-size: 2rem
  color: $primary-color
  margin-bottom: 1.5rem
  letter-spacing: 0.1rem
  +mq(sp)
    font-size: 1.5rem

.not-found-message
  margin-bottom: 2.5rem

.not-found-link
  border: 1px solid gray
  border-radius: 4px
  padding: 0.5rem 1rem
  color: $primary-color
</style>
