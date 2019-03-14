<template lang="pug">
.login-page
  template(v-if="deviceType === 'pc'")
    .login-page-inner-wrap-pc
      .login-left-box
        div
          icon-logo(:size="134" color="white")
        p.login-welcome
          | Welcome to traQ
      .login-right-box
        .login-form
          .input-wrap
            input.input-reset.login-input(
              v-model="name" 
              name="name" 
              type="text" 
              placeholder="ID" 
              required 
              :disabled="status === 'processing'"
              @keydown.enter="loginPost")
            input.input-reset.login-input(
              v-model="pass" 
              name="pass" 
              type="password" 
              placeholder="PASSWORD" 
              required 
              :disabled="status === 'processing'"
              @keydown.enter="loginPost")
            p.login-failed-message(v-if="status === 'failed'")
              | IDまたはパスワードが異なります
          .login-button-wrap
            button.input-reset.login-button(
              @click="loginPost")
              | SIGN IN
        a.login-trap-logo(href="https://trap.jp" target="_blank")
          img(src="@/assets/img/icon/traP_logo.svg")
  template(v-else)
    .login-page-inner-wrap-sp
      .top-background
      .icon-logo
        icon-logo(size="100%")
      .login-welcome-text
        | Welcome to traQ
      .login-form-wrap.drop-shadow
        .input-wrap
          input.input-reset.login-input(
            v-model="name" 
            name="name" 
            type="text" 
            placeholder="ID" 
            required 
            :disabled="status === 'processing'"
            @keydown.enter="loginPost")
          input.input-reset.login-input(
            v-model="pass" 
            name="pass" 
            type="password" 
            placeholder="PASSWORD" 
            required 
            :disabled="status === 'processing'"
            @keydown.enter="loginPost")
          p.login-failed-message(v-if="status === 'failed'")
            | IDまたはパスワードが異なります
        button.input-reset.login-button(
          @click="loginPost")
          | SIGN IN
      a.login-trap-logo(href="https://trap.jp" target="_blank")
        img(src="@/assets/img/icon/traP_logo.svg")
</template>

<script>
import { mapGetters } from 'vuex'
import client from '@/bin/client'
import IconLogo from '@/components/Icon/IconLogo'
import IconLogotraP from '@/components/Icon/IconLogotraP'

export default {
  name: 'login',
  data() {
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
  components: {
    IconLogo,
    IconLogotraP
  },
  methods: {
    loginPost: function() {
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
    ...mapGetters(['deviceType']),
    redirect() {
      return this.$route.query.redirect
        ? `/pipeline?redirect=${encodeURIComponent(this.$route.query.redirect)}`
        : '/pipeline'
    }
  }
}
</script>

<style lang="sass">
.login-page
  width: 100%
  height: 100%

.login-page-inner-wrap-sp
  position: relative
  padding:
    top: 15%

  .top-background
    position: absolute
    height: 60vh
    width: 100%
    top: 0
    right: 0
    background: var(--primary-color)
    z-index: -1

  .icon-logo
    width: 30vw
    margin:
      left: auto
      right: auto

  .login-welcome-text
    width: 100%
    text-align: center
    color: white
    margin:
      top: 10%
    font:
      size: 1.2rem
      weight: bold

  .login-form-wrap
    width: 80%
    max-width: 300px
    margin:
      top: 15%
      left: auto
      right: auto
    border:
      radius: 5px
    background: white
    padding:
      top: 15%
      left: 10%
      right: 10%
      bottom: 15%

  .input-wrap
    position: relative

  .login-input
    width: 100%
    margin:
      bottom: 10%
    border:
      bottom:
        style: solid
        width: 1px
        color: gray

    &:focus
    &:active
    &:valid
    &::placeholder
      font-size: 0.8em
    &:-webkit-autofill
      box-shadow: 0 0 0 1000px #bfdcff inset
      border-color: #4e73d6

  .login-button
    border:
      radius: 50px
    width: 100%
    height: 35px
    font:
      size: 1em
      weight: bold
    color: white
    margin:
      top: 20%
      left: auto
      right: auto
      bottom: auto
    background-color: var(--primary-color)
    transition: all .5s ease
    cursor: pointer

    &:hover
      background-color: var(--secondary-color)
    &:active
      border: none

  .login-failed-message
    position: absolute
    bottom: 0
    transform: translateY(calc(100% ))
    display: block
    margin: auto
    left: 0
    right: 0
    color: var(--warning-color)

  .login-trap-logo
    display: block
    margin:
      top: 10%
      left: auto
      right: auto
    width: 150px

.login-page-inner-wrap-pc
  display: flex

  .login-left-box
    width: 40vw
    height: 100vh
    background-color: var(--primary-color)
    display: flex
    flex-flow: column
    align-items: center
    justify-content: center

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
    margin:
      top: 25px

  .login-form
    height: 90vh
    width: 100%
    display: flex
    flex-flow: column
    align-items: center
    justify-content: center

  .input-wrap
    position: relative
    display: flex
    flex-flow: column
    margin: 0 auto
    width: 100%
    padding:
      top: 60px

  .login-input
    width: 70%
    max-width: 400px
    height: 30px
    margin:
      top: 15px
      left: auto
      right: auto
    padding: 5px 10px
    box-sizing: border-box
    transition: all .5s ease
    border:
      bottom:
        style: solid
        width: 1px
        color: gray

    &:focus
    &:active
    &:valid
    &::placeholder
      font-size: 0.8em
    &:-webkit-autofill
      box-shadow: 0 0 0 1000px #bfdcff inset
      border-color: #4e73d6

  .login-button-wrap

  .login-button
    border:
      radius: 50px
    width: 200px
    height: 35px
    font:
      size: 1em
      weight: bold
    color: white
    margin:
      top: 60px
      left: auto
      right: auto
      bottom: auto
    background-color: var(--primary-color)
    transition: all .5s ease
    cursor: pointer

    &:hover
      background-color: var(--secondary-color)
    &:active
      border: none

  .login-failed-message
    position: absolute
    bottom: 0
    transform: translateY(calc(100% + 20px ))
    display: block
    margin: auto
    width: 250px
    left: 0
    right: 0
    color: var(--warning-color)

  .login-trap-logo
    display: block
    margin:
      top: auto
      bottom: 20px
    width: 150px
</style>
