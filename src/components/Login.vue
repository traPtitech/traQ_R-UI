<template>
  <div>
    <form method="POST" action="/login">
      <input type="text" name="login" placeholder="IDまたはメールアドレス" required/>
      <br>
      <input type="password" name="password" placeholder="パスワード" required/>
      <button>ログイン</button>
    </form>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data () {
    return {
    }
  }
}
</script>

<style scoped>

</style>
