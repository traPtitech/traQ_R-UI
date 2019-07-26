<template lang="pug">
.consent-page
  .consent-page-inner-wrap
    .consent-left-box
      .consent-logo-wrap
        icon-logo(:size="iconSize" color="white")
      a.consent-trap-logo(href="https://trap.jp" target="_blank" tabindex="-1")
        IconLogotraPWide(color="white")
    .consent-right-box.is-scroll
      template(v-if="loading")
        .consent-loading
          span ロード中
      template(v-else-if="clientInfo != null")
        .consent-from-traq-mark
          .consent-from-traq-icon
            img(:src="myIcon")
          .consent-from-traq-dots
          .consent-from-traq-name
            span {{ clientInfo.name }}
        .consent-description
          span.consent-developer-title 開発者
          span.consent-developer-name {{ creator.displayName }} (@{{ creator.name }})
          span.consent-description-title 説明
          span.consent-description-name {{ clientInfo.description }}
        .consent-scope
          .consent-scope-text
            | {{ clientInfo.name }}がtraQアカウントへのアクセスを要求しています
          .consent-scope-list
            span.consent-scope-list-title 許可される項目:
            ul.consent-scope-items
              li.consent-scope-item(v-for="scope in scopes")
                .consent-scope-circle(:style="{color: scope.color}")
                .consent-scope-name {{scope.name}}
                button.consent-scope-button(:class="{open: scope.open}" @click="scope.open = !scope.open")
                transition(name="consent-scope-description")
                  ul.consent-scope-description(v-show="scope.open")
                    li(v-for="desc in scope.description") {{ desc }}
        form.consent-buttons(method="post" action="/api/1.0/oauth2/authorize/decide")
          .consent-button-wrap
            button.cancel-button(
              type="submit"
              name="submit"
              value="deny"
              tabindex="0")
              | キャンセル
          .consent-button-wrap
            button.approve-button(
              type="submit"
              name="submit"
              value="approve"
              tabindex="0")
              | 許可
      template(v-else)
        .consent-fail
          span クライアント情報の取得に失敗しました
</template>

<script>
import { mapGetters } from 'vuex'
import client from '@/bin/client'
import IconLogo from '@/components/Icon/IconLogo'
import IconLogotraPWide from '@/components/Icon/IconLogotraPWide'

export default {
  name: 'consent',
  data() {
    return {
      loading: true,
      clientInfo: null,
      scopeKeys: [],
      scopesData: [
        {
          key: 'read',
          name: 'データの読み取り',
          description: [
            'チャンネル情報の取得',
            'メッセージの取得',
            'チャンネル購読状況(通知をつけているか)の取得',
            '通知の受け取り',
            'ユーザー情報の取得',
            '自ユーザー情報の取得',
            'クリップの取得',
            'クリップフォルダの取得',
            'スター(お気に入り)チャンネルの取得',
            '未読メッセージ一覧の取得',
            'ミュートチャンネルの取得',
            'ユーザーのタグの取得',
            'ユーザーグループの取得',
            'スタンプ情報の取得',
            '自分のスタンプ履歴の取得',
            'お気に入りスタンプの取得',
            'ファイルのダウンロード',
            'オンライン状態の取得',
            'Webhook情報の取得',
            'Bot情報の取得'
          ],
          color: '#F2994A',
          open: false
        },
        {
          key: 'write',
          name: 'データの書き込み',
          description: [
            'チャンネルの作成',
            'チャンネルトピックの変更',
            'メッセージの投稿/編集/削除/通報',
            'メッセージのピン留め/ピン留めの解除',
            'チャンネル購読の変更',
            '通知デバイスの登録',
            '自ユーザー情報/アイコンの変更',
            'クリップの作成/削除',
            'クリップフォルダーの作成/変更/削除',
            'スター(お気に入り)チャンネルの変更',
            'メッセージの既読化',
            'ミュートチャンネルの変更',
            'ユーザーのタグの変更',
            'ユーザーグループの作成/編集/削除',
            'スタンプの作成',
            'メッセージへのスタンプの追加/削除',
            '自分の作成したスタンプの画像の変更',
            'お気に入りスタンプの変更',
            'ファイルのアップロード',
            'オンライン状態の更新',
            'Botのインストール/アンインストール'
          ],
          color: '#F2994A',
          open: false
        },
        {
          key: 'manage_bot',
          name: 'BOTの管理',
          description: [
            'チャンネル情報の取得',
            'ユーザー情報の取得',
            '自ユーザー情報の取得',
            'Webhookの情報の取得',
            'Webhookの作成/変更/削除',
            'BOTの情報の取得',
            'BOTの作成/変更/削除',
            'BOTのインストール/アンインストール',
            'Clientの情報の取得',
            'Clientの作成/編集/削除'
          ],
          color: '#F2994A',
          open: false
        }
      ]
    }
  },
  components: {
    IconLogo,
    IconLogotraPWide
  },
  async created() {
    this.loading = true
    this.scopeKeys = this.$route.query.scopes.split(' ')
    try {
      const { data } = await client.getClient(this.$route.query.client_id)
      this.clientInfo = data
    } catch (e) {
      this.clientInfo = null
    } finally {
      this.loading = false
    }
  },
  computed: {
    ...mapGetters(['nonBotUsers', 'deviceType']),
    myIcon() {
      if (!this.$store.state.me) {
        return ''
      }
      return `${this.$store.state.baseURL}/api/1.0/files/${
        this.$store.state.me.iconFileId
      }`
    },
    iconSize() {
      return this.deviceType === 'pc' ? '100' : '32'
    },
    creator() {
      return this.$store.state.memberMap[this.clientInfo.creatorId]
    },
    scopes() {
      return this.scopesData.filter(s => this.scopeKeys.includes(s.key))
    }
  },
  methods: {
    cancel() {},
    approve() {}
  },
  beforeRouteEnter(to, from, next) {
    if (to.query.client_id && to.query.scopes) {
      next()
    } else {
      next('/')
    }
  }
}
</script>

<style lang="sass">
.consent-page
  width: 100%
  height: 100%

.consent-page-inner-wrap
  display: flex
  height: 100%
  +mq(pc)
    flex-direction: row
  +mq(sp)
    flex-direction: column

.consent-left-box
  display: flex
  justify-content: space-between
  color: white
  background-color: var(--primary-color)
  +mq(pc)
    flex-direction: column
    width: 260px
    padding: 30px
  +mq(sp)
    flex-direction: row
    height: 50px
  .consent-logo-wrap
    +mq(pc)
      margin: 0 auto
    +mq(sp)
      margin: auto 15px
    .consent-logo
      height: 100px
      width: 100px
      .consent-logo-title
        text-align: center
        .consent-trap-logo
          +mq(sp)
            display: none

.consent-right-box
  flex: 1 0
  padding: 5% 15%
  overflow-y: auto
  .consent-from-traq-mark
    margin: 2rem 0
    text-align: center
    .consent-from-traq-icon
      height: 3rem
      width: 3rem
      margin: 0 auto
      img
        border:
          radius: 50%
          style: solid
          width: 0.2rem
          color: var(--primary-color-on-bg)
    .consent-from-traq-dots::after
      content: "・・・・・"
      display: block
      padding-bottom: 0.3em
      margin: 0 auto
      writing-mode: tb
      letter-spacing: -0.5em
      color: var(--primary-color-on-bg)
    .consent-from-traq-name
      margin: 0.5rem 0
      span
        padding: 0.1rem 0.4rem
        background-color: var(--setting-background-color)
        color: var(--secondary-color-on-bg)
        border-radius: 50vh
        text-align: center
  .consent-description
    display: grid
    grid-template-rows: repeat(2, 1fr)
    grid-template-columns: max-content 1fr
    gap: 0.3rem
    margin: 2rem 0
    font-size: 0.9rem
    span
      margin: auto 0
    .consent-developer-title, .consent-description-title
      padding: 0.1rem 0.4rem
      background-color: #828282
      color: white
      border-radius: 50vh
      text-align: center
  .consent-scope
    margin: 2rem 0
    color: var(--bold-text-color)
    .consent-scope-text
      margin: 1rem 0
    .consent-scope-list-title
      font-weight: bold
    .consent-scope-items
      padding: 0.5rem 0
    .consent-scope-item
      position: relative
      display: flex
      flex-direction: row
      flex-wrap: wrap
      padding: 0.75rem

      &+ .consent-scope-item::before
        content: ''
        position: absolute
        top: 0
        left: 0
        width: calc(100% - 1.25rem)
        margin-left: 1.25rem
        border-top:
          style: solid
          color: #d9d9d9
          width: 1px

      .consent-scope-circle
        padding-right: 1rem
        pointer-events: none
        &::before
          content: '●'
          font-size: 12px
          display: inline
      .consent-scope-name
        flex: 1 0
      .consent-scope-button
        background-color: transparent
        color: inherit
        border: none
        cursor: pointer
        &:hover
          background-color: rgba(0,0,0,0.1)
        &::after
          content: '∨'
          display: inline-block
          transform: scale(1, 0.5)
          transform-origin: center
        &.open::after
          content: '∧'

      .consent-scope-description
        width: 100%
        margin-top: 0.5rem
        margin-left: 1rem
        li
          margin: 0.5em 0
          color: var(--text-color)
          list-style: disc inside
      .consent-scope-description-enter-active
        transition-duration: 0.5s
        transition-timing-function: ease-in
      .consent-scope-description-leave-active
        transition-duration: 0.5s
        transition-timing-function: cubic-bezier(0, 1, 0.5, 1)
      .consent-scope-description-enter-to, .consent-scope-description-leave
        max-height: 500px
        overflow: hidden
      .consent-scope-description-enter, .consent-scope-description-leave-to
        max-height: 0
        overflow: hidden

  .consent-buttons
    display: flex
    flex-direction: row
    justify-content: flex-end
    .consent-button-wrap
      margin-left: 1rem
      button
        padding: 0.2rem 0
        width: 80px
        border:
          style: none
          radius: 50px
        font:
          size: 1em
          weight: bold
        transition: all .5s ease
        cursor: pointer
        &.approve-button
          color: white
          background-color: var(--primary-color)
          &:hover
            background-color: var(--secondary-color)
        &.cancel-button
          color: var(--primary-color-on-bg)
          background-color: transparent
          &:hover
            background-color: var(--primary-color-transparent)
        &:active
          border: none
  .consent-loading, .consent-fail
    height: 100%
    display: flex
    flex-direction: column
    justify-content: center
    align-items: center
    span
      text-align: center
</style>
