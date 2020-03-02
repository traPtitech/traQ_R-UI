<template lang="pug">
#app(
  :data-theme="theme"
  :data-eco-mode="$store.state.ecoMode"
  :style="appStyles"
  :class="appClasses"
)
  Splash(v-if="isLoading")
  Favicon
  router-view
</template>

<script>
import { mapGetters } from 'vuex'
import Splash from '@/components/Splash/Splash'
import Favicon from '@/components/Util/Favicon'

export default {
  name: 'app',
  metaInfo() {
    return {
      title: 'Welcome',
      titleTemplate: '%s | traQ',
      meta: [
        {
          name: 'theme-color',
          content: this.themeColor
        }
      ]
    }
  },
  components: {
    Splash,
    Favicon
  },
  data() {
    return {
      splashDisplayed: false
    }
  },
  created() {
    console.log('REVISION:' + process.env.REVISION)
    if ('navigator' in window && 'onLine' in window.navigator) {
      this.$store.commit('changeNetwork', window.navigator.onLine)
    }
    window.addEventListener('offline', () => {
      this.$store.commit('changeNetwork', false)
    })
    window.addEventListener('online', () => {
      this.$store.commit('changeNetwork', true)
    })
    window.addEventListener('beforeunload', () => {
      if (this.$store.getters['rtc/isActive']) {
        const wasCalling = this.$store.getters['rtc/isCalling']

        // ダイアログで閉じる場合のみやりたいけど
        // dispatchが非同期なのでunloadイベントでは行えないので
        // 仕方なく常に切断する(Chromeだと切断されない)
        this.$store.dispatch('rtc/closeConnection')

        if (wasCalling) {
          const unloadMessage = 'Qall中ですが本当に終了しますか？'
          event.preventDefault()
          event.returnValue = unloadMessage
          return unloadMessage
        }
      }
    })
  },
  methods: {
    handleResizeWindow() {
      this.$store.commit('setWindowSize', {
        windowWidth: window.innerWidth,
        windowHeight: window.innerHeight
      })
    },
    toggleTheme(mql) {
      if (mql.matches) {
        this.$store.dispatch('updateTheme', 'dark')
      } else {
        this.$store.dispatch('updateTheme', 'light')
      }
    }
  },
  computed: {
    ...mapGetters(['windowWidth', 'windowHeight']),
    vh() {
      return this.windowHeight * 0.01
    },
    isLoading() {
      return !(this.$store.state.loaded && this.$store.state.loadedComponent)
    },
    appStyles() {
      return {
        '--vh': `${this.vh}px`
      }
    },
    appClasses() {
      return {
        'app-loaded': !this.isLoading
      }
    },
    theme() {
      return this.$store.state.theme
    },
    themeColor() {
      return this.theme === 'light' ? '#0D67EA' : '#232C36'
    }
  },
  watch: {
    theme(val) {
      const $themeColor = document.querySelector('meta[name="theme-color"]')
      if ($themeColor.content !== this.themeColor) {
        $themeColor.content = this.themeColor
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.handleResizeWindow()
      const isDark = window.matchMedia('(prefers-color-scheme: dark)')
      isDark.addListener(this.toggleTheme)
    })
    window.addEventListener('resize', this.handleResizeWindow)
    window.addEventListener('orientationchange', this.handleResizeWindow)
  }
}
</script>

<style lang="sass">
@import "~@/styles/global.sass"
#app
  position: fixed
  top: 0
  right: 0
  width: 100%
  height: 100%
  font-family: 'Noto Sans JP','メイリオ', Meiryo,'Hiragino Kaku Gothic ProN','ヒラギノ角ゴ ProN W3','ＭＳ Ｐゴシック','MS PGothic','MS UI Gothic','Helvetica','Arial',sans-serif
  -webkit-font-smoothing: antialiased
  -moz-osx-font-smoothing: grayscale
  color: var(--text-color)
  background-color: #0D67EA
  background: var(--background-color)

  & + .initial-splash
    z-index: -1

.app-loaded + .initial-splash
  display: none
</style>
