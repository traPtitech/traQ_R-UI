<template lang="pug">
#app(:data-theme="$store.getters.theme" :style="appStyles" :class="appClasses")
  Favicon
  Splash(v-if="isLoading")
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
    if (process.env.NODE_ENV === 'production' && navigator.serviceWorker) {
      navigator.serviceWorker
        .register('/sw.js', { scope: '/' })
        .then(regisration => {
          console.log('Service Worker Registered!')
          regisration.update()
        })
    }

    if ('navigator' in window && 'onLine' in window.navigator) {
      this.$store.commit('changeNetwork', window.navigator.onLine)
    }
    window.addEventListener('offline', () => {
      this.$store.commit('changeNetwork', false)
    })
    window.addEventListener('online', () => {
      this.$store.commit('changeNetwork', true)
    })
  },
  methods: {
    handleResizeWindow() {
      this.$store.commit('setWindowSize', {
        windowWidth: window.innerWidth,
        windowHeight: window.innerHeight
      })
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
    themeColor() {
      return this.$store.state.theme === 'light' ? '#0D67EA' : '#232C36'
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.handleResizeWindow()
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
  top: 0;
  right: 0;
  width: 100%
  height: 100%
  font-family: 'Mplus 1p','メイリオ', Meiryo,'Hiragino Kaku Gothic ProN','ヒラギノ角ゴ ProN W3','ＭＳ Ｐゴシック','MS PGothic','MS UI Gothic','Helvetica','Arial',sans-serif
  -webkit-font-smoothing: antialiased
  -moz-osx-font-smoothing: grayscale
  color: var(--text-color)
  background-color: #0D67EA
  background: var(--background-color)

.app-loaded + .initial-splash
  display: none

</style>
