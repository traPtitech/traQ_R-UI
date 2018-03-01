<template lang="pug">
div
  div.register-container
    div
      | ユーザー登録
    div.register-item
      div.register-label
        | ユーザー名
      input(type="text" v-model="name")
    div.register-item
      div.register-label
        | パスワード
      input(type="password" v-model="password")
    div.register-item
      div.register-label
        | パスワード(再入力)
      input(type="password" v-model="confirmPassword")
    div.register-item
      div.register-label
        | メールアドレス
      input(type="text" v-model="email")
    div.register-item
      button(@click="register")
        | 登録
</template>

<script>
import client from '@/bin/client'
export default {
  name: 'Register',
  data () {
    return {
      name: '',
      password: '',
      confirmPassword: '',
      email: ''
    }
  },
  methods: {
    register () {
      if (this.password !== this.confirmPassword) {
        alert('パスワードが異なります！')
      }

      if (!(this.password && this.password && this.confirmPassword && this.email)) {
        alert('すべての項目に入力してください！')
        return
      }

      if (confirm('登録してよろしいですか？')) {
        client.registerUser(this.name, this.password, this.email)
        this.name = ''
        this.password = ''
        this.confirmPassword = ''
        this.email = ''
      }
    }
  }
}
</script>

<style lang="sass">
.register-container
  display: flex;
  flex-direction: column;
  justify-content: center;

.register-item
  display: flex;
  justify-content: center;

.register-label
  width: 160px;


</style>

