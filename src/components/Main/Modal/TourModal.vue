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
  .tour-modal-footer
    .tour-page-indicator
      .tour-page-indicator-dot(v-for="(_, i) in anims" :class="{'tour-indicator-active': i === page}" @click="goToPage(i)")
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
      page: 0,
      scrollertWidth: 0,
      pageWidth: 0
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
    },
    updatePage() {
      const parent = this.$refs.scroller.getBoundingClientRect()
      const page = this.$refs.container1.getBoundingClientRect()
      this.scrollerWidth = parent.width

      const pageOffset = parent.left - page.left + 16
      this.page = Math.round(pageOffset / this.scrollerWidth)
    },
    goToPage(page) {
      if (page < 0 || page >= this.anims.length) {
        return
      }
      this.$refs.scroller.scrollLeft = this.scrollerWidth * page
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
        path: '/static/onboarding3.json'
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
    this.$refs.scroller.addEventListener('scroll', this.updatePage)
    window.addEventListener('resize', this.resizeAnimationContainer)
    this.updatePage()
  },
  destroyed() {
    this.anims.forEach(a => a.destroy())
    window.removeEventListener('resize', this.resizeAnimationContainer)
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
  scroll-behavior: smooth
  scrollbar-width: none
  &::-webkit-scrollbar
    display: none

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
  width: 100%
  max-height: 30vw
  flex-basis: 30vw
  flex-shrink: 0
  flex-grow: 0

.tour-description
  display: flex
  flex-direction: column
  align-items: center
  margin-top: 1rem
  line-height: 1.6rem
  text-align: center
  h2
    color: $primary-color-on-bg
    margin: 0.5rem 0

.tour-modal-footer
  display: flex
  width: 100%
  justify-content: center

.tour-page-indicator
  display: flex
  justify-content: space-between
.tour-page-indicator-dot
  width: 0.5rem
  height: 0.5rem
  border-radius: 50%
  background-color: $primary-color-on-bg
  opacity: 0.1
  margin: 1rem
  cursor: pointer
.tour-indicator-active
  opacity: 1
</style>
