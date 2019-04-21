<template lang="pug">
.tour-modal(:style="modalStyle")
  .tour-modal-horozontal-scroller(ref="scroller")
    .tour-container
      .tour-anim-container(ref="container1")
      .tour-description
        h2 チャンネル
        p
          | traQでの会話は階層化された「チャンネル」の中で行われています。
        p
          | よく見るチャンネルは通知をつけて、お気に入りに登録しましょう！
    .tour-container
      .tour-anim-container(ref="container2")
      .tour-description
        h2 ユーザー情報・DM
        p
          | ユーザーのアイコンからユーザーの詳細情報を確認できます。
        p
          | この画面からユーザーとのダイレクトメッセージ(DM)へ移動できます。
    .tour-container
      .tour-anim-container(ref="container3")
      .tour-description
        h2 リアクション
        p
          | traQではリアクションでのコミュニケーションが活発です。
        p
          | メッセージの右上から、リアクションをつけてみましょう！
</template>

<script>
import { mapState } from 'vuex'
import lottie from 'lottie-web'
import MemberElement from '@/components/Main/Sidebar/Content/MemberElement'
import BaseCommonModal from '@/components/Main/Modal/BaseCommonModal'
import IconProfileFill from '@/components/Icon/IconProfileFill'
import IconBack from '@/components/Icon/IconBack'

export default {
  name: 'TourModal',
  components: {
    BaseCommonModal,
    MemberElement,
    IconProfileFill,
    IconBack
  },
  data() {
    return {
      anims: [],
      dataLoaded: false,
      numLoadDone: 0,
      numAnims: 1,
      page: 0
    }
  },
  computed: {
    ...mapState('modal', ['data']),
    modalStyle() {
      return {
        opacity: this.dataLoaded ? '1' : '0'
      }
    }
  },
  methods: {
    resizeAnimationContainer() {
      const aspectRatio = 16 / 9
      document.querySelectorAll('.tour-anim-container').forEach(e => {
        e.style.width = ''
        // preserve aspect ratio
        const rect = e.getBoundingClientRect()
        e.style.width = `${rect.height * aspectRatio}px`
      })
    },
    closeModal() {
      this.$store.dispatch('modal/close')
    }
  },
  watch: {
    page(val, prev) {
      if (
        val < 0 ||
        prev < 0 ||
        val >= this.anims.length ||
        prev > this.anims.length
      )
        return
      setTimeout(() => {
        this.anims[val].play()
        this.anims[prev].stop()
      }, 500)
    }
  },
  async mounted() {
    this.resizeAnimationContainer()
    this.anims.push(
      lottie.loadAnimation({
        container: this.$refs.container1,
        renderer: 'svg',
        loop: true,
        autoplay: false,
        path: '/static/onboarding1.json'
      }),
      lottie.loadAnimation({
        container: this.$refs.container2,
        renderer: 'svg',
        loop: true,
        autoplay: false,
        path: '/static/onboarding2.json'
      }),
      lottie.loadAnimation({
        container: this.$refs.container3,
        renderer: 'svg',
        loop: true,
        autoplay: false,
        path: '/static/onboarding1.json'
      })
    )
    this.anims.forEach(a => {
      a.addEventListener('data_ready', () => {
        this.numLoadDone += 1
        this.dataLoaded = this.numLoadDone >= this.numAnims
        if (this.dataLoaded) {
          setTimeout(() => {
            this.anims[0].play()
          }, 1000)
        }
      })
    })
    this.$refs.scroller.addEventListener('scroll', event => {
      const parent = event.target.getBoundingClientRect()
      const page = this.$refs.container1.getBoundingClientRect()
      const pageOffset = parent.left - page.left + 16
      this.page = Math.round(pageOffset / parent.width)
    })
    window.addEventListerner('resize', this.resizeAnimationContainer)
  },
  destroyed() {
    this.anims.forEach(a => a.destroy())
    window.removeEventListerner('resize', this.resizeAnimationContainer)
  }
}
</script>

<style lang="sass">
.tour-modal
  transition: all 0.3s ease
  background: $background-color
  border-radius: $modal-border-radius
  max-width: 60rem
  width: 90vw
  height: min-content
  padding: 1rem
.tour-modal-horozontal-scroller
  display: flex
  overflow: scroll
  scroll-snap-type: x mandatory
.tour-container
  width: 100%
  height: 100%
  flex: 100% 0 0
  display: flex
  align-items: center
  flex-direction: column
  padding: 1rem
  overflow: scroll
  scroll-snap-align: start
.tour-anim-container
  max-height: 30vw
  flex-basis: 30vw
  flex-shrink: 1
  flex-grow: 0
.tour-description
  display: flex
  flex-direction: column
  align-items: center
  margin-top: 1rem
  line-height: 1.6rem
  text-align: center
  h2
    color: $primary-color
    margin: 0.5rem 0
</style>
