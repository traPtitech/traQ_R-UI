<template lang="pug">
  div.login this is login page
    form(method="POST" action="/login")
      input(type="text" name="name" placeholder="ID または メールアドレス" required)
      br
      input(type="password" name="password" placeholder="パスワード" required)
      br
      button
        | ログイン
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
