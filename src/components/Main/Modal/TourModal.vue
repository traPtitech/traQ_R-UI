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
    a.tour-link(v-if="page === 0" href="https://wiki.trapti.tech/general/traQ-R")
      .tour-link-icon
        icon-book(color="var(--primary-color)")
    .tour-link.tour-go-back(v-else @click="goToPrevPage")
      .tour-link-icon
        icon-back(color="var(--primary-color)" size="14")
      | 戻る
    .tour-page-indicator
      .tour-page-indicator-dot(v-for="(_, i) in anims" :class="{'tour-indicator-active': i === page}" @click="goToPage(i)")
    .tour-link.tour-go-next(v-if="page === anims.length - 1" @click="closeModal")
      | OK!
      .tour-link-icon
        icon-check(color="var(--primary-color)" size="16")
    .tour-link.tour-go-next(v-else @click="goToNextPage")
      | 次へ
      .tour-link-icon.tour-link-icon-go-next
        icon-back(color="var(--primary-color)" size="14")
</template>

<script>
import { mapState } from 'vuex'
import lottie from 'lottie-web'
import MemberElement from '@/components/Main/Sidebar/Content/MemberElement'
import BaseCommonModal from '@/components/Main/Modal/BaseCommonModal'
import IconAngleRight from '@/components/Icon/IconAngleRight'
import IconBack from '@/components/Icon/IconBack'
import IconBook from '@/components/Icon/IconBook'
import IconCheck from '@/components/Icon/IconCheck'

export default {
  name: 'TourModal',
  components: {
    BaseCommonModal,
    MemberElement,
    IconAngleRight,
    IconBack,
    IconBook,
    IconCheck
  },
  data() {
    return {
      anims: [],
      dataLoaded: false,
      numLoadDone: 0,
      numAnims: 1,
      page: 0,
      mobileThreshould: 680
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
      const isMobile = window.innerWidth < this.mobileThreshould
      const aspectRatio = isMobile ? 1 : 16 / 9
      document.querySelectorAll('.tour-anim-container').forEach(e => {
        e.style.width = ''
        // preserve aspect ratio
        const rect = e.getBoundingClientRect()
        const normalizedHeight = rect.height * aspectRatio
        if (normalizedHeight > rect.width) {
          e.style.width = `${normalizedHeight}px`
        } else {
          e.style.height = `${rect.width / aspectRatio}px`
        }
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
    },
    goToNextPage() {
      this.goToPage((this.page + 1) % this.anims.length)
    },
    goToPrevPage() {
      this.goToPage((this.page - 1) % this.anims.length)
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
    const isMobile = window.innerWidth < this.mobileThreshould
    const pathStr = i =>
      `/static/onboarding${isMobile ? '_mobile_' : ''}${i}.json`
    this.anims.push(
      lottie.loadAnimation({
        container: this.$refs.container1,
        renderer: 'svg',
        loop: true,
        autoplay: false,
        path: pathStr(1)
      }),
      lottie.loadAnimation({
        container: this.$refs.container2,
        renderer: 'svg',
        loop: true,
        autoplay: false,
        path: pathStr(2)
      }),
      lottie.loadAnimation({
        container: this.$refs.container3,
        renderer: 'svg',
        loop: true,
        autoplay: false,
        path: pathStr(3)
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
  padding: 1rem
  +mq(sp)
    width: 95vw

.tour-modal-horozontal-scroller
  display: flex
  overflow: scroll
  scroll-snap-type: x mandatory
  scroll-behavior: smooth
  scrollbar-width: none
  -webkit-overflow-scrolling: touch
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
  +mq(sp)
    padding:
      top: 0.5rem
      bottom: 0.25rem
      left: 1rem
      right: 1rem
  overflow: scroll
  scroll-snap-align: start

.tour-anim-container
  width: 100%
  max-height: 50vh

.tour-description
  display: flex
  flex-direction: column
  align-items: center
  margin-top: 1rem
  flex:
    shrink: 0
    grow: 0
  line-height: 1.6rem
  +mq(sp)
    margin-top: 0.5rem
    font-size: 0.85rem
  h2
    color: $primary-color-on-bg
    margin: 0.5rem 0
    font-size: 1.1rem
    font-weight: bold
    +mq(sp)
      font-size: 1.05rem

.tour-modal-footer
  display: flex
  width: 100%
  padding: 0 0.5rem
  justify-content: space-between
  align-items: center

.tour-link
  color: $primary-color-on-bg
  &:link, &:hover, &:visited
    color: $primary-color-on-bg
  cursor: pointer
  display: flex
  align-items: center

.tour-link-icon
  margin: 0.5rem
  transform: translateY(1px)

.tour-link-icon-go-next
  transform: translateY(1px) rotate(180deg)

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
