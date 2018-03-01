<template lang="pug">
div.login this is login page
  br
  input(v-model="name" type="text" placeholder="IDまたはメールアドレス")
  br
  input(v-model="pass" type="password" placeholder="パスワード")
  br
  button(v-on:click="loginPost()")
    p login
  br
  p(v-if="status === 'failed'") IDまたはパスワードが異なります
</template>

<script>
import client from '@/bin/client'
export default {
  name: 'login',
  data () {
    return {
      name: '',
      pass: '',
      status: 'default'
      /*
       * default: not in progress
       * processing: in progress
       * failed: missed login
       * successed: success login
       */
    }
  },
  methods: {
    loginPost: function () {
      this.status = 'processing'
      client.login(this.name, this.pass)
      .then(res => {
        this.status = 'successed'
        console.log(res)
        this.$store.commit('loadStart')
        this.$store.dispatch('whoAmI')
        .then(() => {
          this.$router.push('/channels/random')
        })
      })
      .catch(err => {
        this.status = 'failed'
        console.error(err)
      })
    }
  }
}
</script>

<style lang="scss">
</style>
