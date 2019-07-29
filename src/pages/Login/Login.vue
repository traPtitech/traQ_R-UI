<template lang="pug">
.login-page
  template(v-if="deviceType === 'pc'")
    .login-page-inner-wrap-pc
      .login-left-box
        div
          icon-logo(size="134" color="white")
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
              autofocus
              tabindex="0"
              @keydown.enter="loginPost")
            input.input-reset.login-input(
              v-model="pass"
              name="pass"
              type="password"
              placeholder="PASSWORD"
              required
              :disabled="status === 'processing'"
              tabindex="0"
              @keydown.enter="loginPost")
            p.login-failed-message(v-if="status === 'failed'")
              span(v-if="failType === 'empty_id'")
                | IDが入力されていません
              span(v-else-if="failType === 'empty_pass'")
                | パスワードが入力されていません
              span(v-else-if="failType === 'unconnected'")
                | インターネットに接続されていません
              span(v-else-if="failType === 'wrong_id_or_pass'")
                | IDまたはパスワードが異なります
              span(v-else)
                | エラーが発生しました
          .login-button-wrap
            button.input-reset.login-button(
              tabindex="0"
              @click="loginPost")
              | SIGN IN
          a.password-restpage-link(href="https://portal.trap.jp/reset-password" target="_blank") パスワードを忘れた方はこちら
          .login-suspended-wrap(v-if="status === 'suspended'")
            p.login-suspended-message
              | このアカウントは部費が納入されていない等の理由により、traPの部員条件を満たさない事が確認された為に現在凍結されております。
              | 復旧を希望する場合は、accounts@trap.jpへその旨をご連絡ください。
              | 半期分の部費の支払い方法等について追ってご連絡いたします。その後支払いが確認でき次第アカウントを復旧いたします。
        a.login-trap-logo(href="https://trap.jp" target="_blank" tabindex="-1")
          IconLogotraPWide
  template(v-else)
    .login-page-inner-wrap-sp.is-scroll
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
            autofocus
            tabindex="0"
            @keydown.enter="loginPost")
          input.input-reset.login-input(
            v-model="pass"
            name="pass"
            type="password"
            placeholder="PASSWORD"
            required
            :disabled="status === 'processing'"
            tabindex="0"
            @keydown.enter="loginPost")
          p.login-failed-message(v-if="status === 'failed'")
            span(v-if="failType === 'empty_id'")
              | IDが入力されていません
            span(v-else-if="failType === 'empty_pass'")
              | パスワードが入力されていません
            span(v-else-if="failType === 'unconnected'")
              | インターネットに接続されていません
            span(v-else-if="failType === 'wrong_id_or_pass'")
              | IDまたはパスワードが異なります
            span(v-else)
              | エラーが発生しました
        button.input-reset.login-button(
          tabindex="0"
          @click="loginPost")
          | SIGN IN
        a.password-restpage-link(href="https://portal.trap.jp/reset-password" target="_blank") パスワードを忘れた方はこちら
        .login-suspended-wrap(v-if="status === 'suspended'")
          p.login-suspended-message
            | このアカウントは部費が納入されていない等の理由により、traPの部員条件を満たさない事が確認された為に現在凍結されております。
            | 復旧を希望する場合は、accounts@trap.jpへその旨をご連絡ください。
            | 半期分の部費の支払い方法等について追ってご連絡いたします。その後支払いが確認でき次第アカウントを復旧いたします。
      a.login-trap-logo(href="https://trap.jp" target="_blank"
            tabindex="-1")
        IconLogotraPWide
</template>

<script>
import { mapGetters } from 'vuex'
import client from '@/bin/client'
import IconLogo from '@/components/Icon/IconLogo'
import IconLogotraPWide from '@/components/Icon/IconLogotraPWide'

export default {
  name: 'login',
  data() {
    return {
      name: '',
      pass: '',
      // default / processing / succeed / failed / suspended
      status: 'default',
      // empty_id / empty_pass / unconnected / wrong_id_or_pass
      failType: ''
    }
  },
  components: {
    IconLogo,
    IconLogotraPWide
  },
  methods: {
    loginPost: function() {
      if (this.name === '') {
        this.status = 'failed'
        this.failType = 'empty_id'
        return
      } else if (this.pass === '') {
        this.status = 'failed'
        this.failType = 'empty_pass'
        return
      }

      this.status = 'processing'
      client
        .login(this.name, this.pass)
        .then(res => {
          this.status = 'succeed'
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
          this.failType = ''
          const statusCode = /(\d{3})/.exec(err.message)[1]
          switch (statusCode) {
            case '500':
              this.failType = 'unconnected'
              break
            case '401':
              this.failType = 'wrong_id_or_pass'
              break
            case '403':
              this.status = 'suspended'
              break
            default:
              this.failType = 'unknown'
              break
          }
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
  height: 100%
  overflow-y: scroll
  position: relative
  padding:
    top: 50px

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
    max-width: 100px
    margin:
      left: auto
      right: auto

  .login-welcome-text
    width: 100%
    text-align: center
    color: white
    margin:
      top: 10px
    font:
      size: 1.2rem
      weight: bold

  .login-form-wrap
    width: 80%
    max-width: 300px
    margin:
      top: 30px
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

  .password-restpage-link
    display: block
    color: #949494
    text-align: center
    text-decoration: underline
    margin:
      top: 30px
      right: auto
      left: auto
    font-size: 0.8rem


  .login-trap-logo
    display: block
    margin:
      top: 30px
      left: auto
      right: auto
    width: 150px

  .login-suspended-wrap
    border-radius: 16px
    padding: 18px
    margin-top: 12px
    background-color: #ED8888

  .login-suspended-message
    color: white

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

  .password-restpage-link
    color: #949494
    text-align: center
    text-decoration: underline
    margin-top: 20px
    font-size: 0.8rem

  .login-trap-logo
    display: block
    margin:
      top: auto
      bottom: 20px
    width: 150px

  .login-suspended-wrap
    border-radius: 16px
    padding: 24px
    margin: 40px 15%
    background-color: #ED8888

  .login-suspended-message
    color: white
</style>
