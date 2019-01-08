<template lang="pug">
div#app(:data-theme="$store.state.theme")
  Favicon
  splash(v-if="!$store.state.loaded || !$store.state.loadedComponent")
  router-view(v-else)
</template>

<script>
import Splash from '@/components/Splash/Splash'
import Favicon from '@/components/Util/Favicon'
import 'normalize.css'
import 'highlight.js/styles/default.css'
export default {
  name: 'app',
  metaInfo: {
    title: 'Welcome',
    titleTemplate: '%s | traQ'
  },
  components: {
    Splash,
    Favicon
  },
  created () {
    console.log('REVISION:' + process.env.REVISION)
    if (process.env.NODE_ENV === 'production' && navigator.serviceWorker) {
      navigator.serviceWorker.register('/sw.js', {scope: '/'})
        .then(regisration => {
          console.log('Service Worker Registered!')
          regisration.update()
        })
    }
  }
}
</script>

<style lang="sass">
@import "~@/styles/global.sass"
#app
  font-family: 'Mplus 1p','メイリオ', Meiryo,'Hiragino Kaku Gothic ProN','ヒラギノ角ゴ ProN W3','ＭＳ Ｐゴシック','MS PGothic','MS UI Gothic','Helvetica','Arial',sans-serif
  -webkit-font-smoothing: antialiased
  -moz-osx-font-smoothing: grayscale
  color: $text-color
  background-color: $background-color
</style>
