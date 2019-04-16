<template lang="pug">
base-common-modal.tour-modal(title="" :style="modalStyle")
  .tour-container
    .tour-anim-container(ref="container")
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
      numAnims: 1
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
    closeModal() {
      this.$store.dispatch('modal/close')
    }
  },
  mounted() {
    this.anims.push(
      lottie.loadAnimation({
        container: this.$refs.container,
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
          }, 500)
        }
      })
    })
  }
}
</script>

<style lang="sass">
.tour-modal
  transition: all 0.3s ease
.tour-description
  margin-top: 1rem
  h2
    margin: 0.5rem 0
</style>
