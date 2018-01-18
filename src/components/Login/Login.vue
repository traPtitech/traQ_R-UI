<template lang="pug">
  div.login this is login page
    router-link(:to="{name: 'Index'}")
      p login
</template>

<script>
export default {
  name: 'login'
}
</script>

<style lang="scss">
</style>
