<template lang="pug">
div.login
  div.login-left-box
    p.login-welcome
      | Welcome to traQ
  div.login-right-box
    .input-wrap.login-form
      input.input-reset.login-input.input-id(v-model="name" name="name" type="text" placeholder="ID" required @keydown.enter="loginPost")
      input.input-reset.login-input.input-password(v-model="pass" name="pass" type="password" placeholder="パスワード" required @keydown.enter="loginPost")
    .login-button-wrap
      button.login-button(@click="loginPost")
        p ログイン
      p.login-failed-message(v-if="status === 'failed'") IDまたはパスワードが異なります
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
      client
        .login(this.name, this.pass)
        .then(res => {
          this.status = 'successed'
          console.log(res)
          if (this.$store.state.baseURL === '') {
            document.location.href = this.redirect
          } else {
            this.$store.commit('loadStart')
            this.$store.dispatch('whoAmI').then(() => {
              this.$router.push('/channels/random')
            })
          }
        })
        .catch(err => {
          this.status = 'failed'
          console.error(err)
        })
    }
  },
  computed: {
    redirect () {
      return this.$route.query.redirect
        ? `/pipeline?redirect=${encodeURIComponent(this.$route.query.redirect)}` : '/pipeline'
    }
  }
}
</script>

<style lang="sass">
.login
  display: flex
  background: white

.login-left-box
  width: 40vw
  height: 100vh
  background-color: var(--primary-color)
  display: flex
  align-items: center

.login-right-box
  flex: 1
  height: 100vh
  display: flex
  align-items: center
  justify-content: center
  flex-flow: column

.login-welcome
  font-weight: bold
  color: white
  text-align: center
  width: 100%

.input-wrap
  display: flex
  flex-flow: column
  margin: 0 auto

.login-input
  width: 200px
  height: 30px
  margin: 5px auto
  padding: 5px 10px
  box-sizing: border-box
  border: solid 1px #8c8c8c
  transition: all .5s ease
  &:active
  &:valid
  &::placeholder
    font-size: 0.8em
  &:-webkit-autofill
    box-shadow: 0 0 0 1000px #bfdcff inset
    border-color: #4e73d6

.login-button-wrap
  position: relative

.login-button
  border: none
  width: 200px
  height: 30px
  font-size: 1em
  color: white
  margin: 5px auto
  background-color: #4f74d6
  transition: all .5s ease
  cursor: pointer
  &:hover
    background-color: #4254a6
  &:active
    border: none

.login-failed-message
  position: absolute
  display: block
  margin: 10px 0 0 0
  width: 250px
  background-color: #4f74d6
  border-radius: 3px
  color: white

</style>
