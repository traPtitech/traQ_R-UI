<template lang="pug">
  div.stamp-picker-container
    div.stamp-picker-header
      DebouncedInput.stamp-picker-search(v-model="search" :placeholder="searchPlaceHolder")
      div.stamp-picker-search-icon
        icon-search(color="gray")
    transition-group.stamp-picker-body.is-scroll(
      tag="div"
      :name="stampContainerTransitionName"
      @mouseleave="searchPlaceHolder=defaultString")
        template(
          v-if="search.length === 0" )
          div.stamp-picker-body-container(
            v-for="(category, idx) in stampCategolized"
            v-show="idx==currentCategoryIndex"
            :key="category.category")
            p.stamp-picker-category-name
              | {{category.category}}
            div.stamp-picker-body-inner-wrapper
              div.stamp-picker-stamp-item-wrapper.flex-center(
                v-for="stamp in stamps(idx)"
                :key="stamp.id"
                @click="addStamp(stamp)"
                @mouseover="hoverStamp(stamp.name)")
                div.stamp-picker-stamp-item(
                  v-lazy:background-image="fileUrl(stamp.fileId)"
                  :title="`:${stamp.name}:`")
              div.stamp-picker-stamp-item-dummy(v-for="i in 20")
        template(
          v-else)
          div.stamp-picker-body-container(
            key="filtered")
            p.stamp-picker-category-name
              | 検索結果
            div.stamp-picker-body-inner-wrapper
              div.stamp-picker-stamp-item-wrapper.flex-center(
                :key="stamp.id"
                v-for="stamp in filteredStamps"
                @click="addStamp(stamp)"
                @mouseover="hoverStamp(stamp.name)")
                div.stamp-picker-stamp-item(
                  :style="stampItemStyle(stamp.fileId)"
                  :title="`:${stamp.name}:`")
              div.stamp-picker-stamp-item-dummy(v-for="i in 20" :key="i")
    div.stamp-picker-footer
        div.stamp-category-wrap
          div.stamp-category-item.flex-center(
            v-for="(category,idx) in stampCategolized"
            @click="currentCategoryIndex = idx"
            :class="{'stamp-picker-category-selected': idx === currentCategoryIndex}")
            component(
              :is="categoryIcon(idx)"
              :size="idx <= 1 ? '20' : '28'"
              :color="idx === currentCategoryIndex ? 'var(--primary-color-on-bg)' : 'gray'")
</template>

<script>
import { mapGetters } from 'vuex'
import { isTouchDevice } from '@/bin/utils'
import stampAltNameTable from '@/bin/emoji_altname_table.json'
import DebouncedInput from '@/components/Util/DebouncedInput'
import IconSearch from '@/components/Icon/IconSearch'
import IconClock from '@/components/Icon/IconClock'
import IconLogo from '@/components/Icon/IconLogo'
import IconSmile from '@/components/Icon/IconSmile'
import IconDogFace from '@/components/Icon/IconDogFace'
import IconHamburger from '@/components/Icon/IconHamburger'
import IconSoccerBall from '@/components/Icon/IconSoccerBall'
import IconAirPlane from '@/components/Icon/IconAirPlane'
import IconLightBulb from '@/components/Icon/IconLightBulb'
import IconHeart from '@/components/Icon/IconHeart'
import IconFlag from '@/components/Icon/IconFlag'
import IconRegional from '@/components/Icon/IconRegional'

export default {
  name: 'StampPicker',
  props: {},
  components: { DebouncedInput, IconSearch },
  data() {
    return {
      search: '',
      defaultString: 'スタンプを検索',
      searchPlaceHolder: 'スタンプを検索',
      currentCategoryIndex: 0,
      stampContainerTransitionName: 'slide-right',
      doFilter: false,
      categoryIcons: [
        IconClock,
        IconLogo,
        IconSmile,
        IconDogFace,
        IconHamburger,
        IconSoccerBall,
        IconAirPlane,
        IconLightBulb,
        IconHeart,
        IconFlag,
        IconRegional
      ]
    }
  },
  computed: {
    ...mapGetters(['fileUrl']),
    active() {
      return this.$store.getters.stampPickerActive
    },
    model() {
      return this.$store.getters.stampPickerModel
    },
    stampCategolized() {
      return [this.stampHistory].concat(this.$store.state.stampCategolized)
    },
    stampHistory() {
      return {
        category: 'history',
        stamps: this.$store.getters.stampHistory
      }
    },
    filteredStamps() {
      let filterFunc
      if (this.search.length === 1) {
        filterFunc = (a, b) => a === b
      } else {
        filterFunc = (a, b) => a.includes(b)
      }

      const filteredAltName = stampAltNameTable
        .filter(stamp => filterFunc(stamp.altName, this.search))
        .map(stamp => stamp.name)

      return this.stampCategolized
        .slice(1, this.stampCategolized.length)
        .map(c => c.stamps)
        .flat()
        .filter(
          stamp =>
            filterFunc(stamp.name, this.search) ||
            filteredAltName.includes(stamp.name)
        )
    }
  },
  methods: {
    addStamp(stamp) {
      this.$store.dispatch('execStamp', stamp)
    },
    stamps(index) {
      return this.stampCategolized[index].stamps
    },
    hoverStamp(name) {
      this.searchPlaceHolder = name
    },
    stampItemStyle(fileId) {
      return `background-image: url(${this.fileUrl(fileId)})`
    },
    categoryIcon(categoryIndex) {
      return this.categoryIcons[categoryIndex]
    }
  },
  watch: {
    currentCategoryIndex(newIndex, oldIndex) {
      this.stampContainerTransitionName =
        newIndex > oldIndex ? 'slide-right' : 'slide-left'
    }
  },
  created() {
    this.$store.dispatch('getStampHistory')
  },
  mounted() {
    if (isTouchDevice()) {
      return
    }
    const input = this.$el.querySelector('.stamp-picker-search')
    if (input) {
      input.focus()
    }
  }
}
</script>

<style lang="sass">
.stamp-picker

.stamp-picker-container
  display: flex
  flex-flow: column
  height: 100%
  overflow: hidden

.stamp-picker-header
  position: relative

.stamp-picker-search
  outline: none
  border: none
  border:
    radius: 4px
  box-sizing: border-box
  color: var(--text-color)
  width: calc( 100% - 10px*2 )
  height: 30px
  margin: 10px 10px 10px
  padding:
    top: 5px
    left: 5px
    right: 30px
    bottom: 5px
  background: var(--setting-background-color)

.stamp-picker-search-icon
  display: inline-flex
  align-items: center
  position: absolute
  top: 50%
  right: 20px
  transform: translateY(-50%)

.stamp-category-wrap
  display: flex
  justify-content: space-between
  padding:
    left: 10px
    right: 10px

.stamp-category-item
  width: 25px
  height: 40px
  padding:
    top: 2px
    right: 2px
    left: 2px
    bottom: 2px
  cursor: pointer
  box-sizing: content-box

  &:hover
    background: var(--background-hover-color)

.stamp-picker-category-selected
  position: relative

  &::before
    content: ''
    display: block
    position: absolute
    top: 0
    left: 0
    right: 0
    width: 100%
    height: 3px
    background: var(--primary-color-on-bg)

.stamp-picker-body
  position: relative
  flex-grow: 1
  overflow:
    x: hidden

.stamp-picker-body-container
  will-change: transform, opacity
  // position: absolute
  width: 100%
  height: 100%
  padding: 6px 12px 6px
  overflow: visible

.stamp-picker-body-inner-wrapper
  display: flex
  flex-wrap: wrap
  justify-content: center

.stamp-picker-category-name
  font-weight: bold
  margin-bottom: 12px

.stamp-picker-footer
  z-index: 1
  box-shadow: 0 -1px 5px 0 rgba(0,0,0,0.3)
  // border-top: solid 1px var(--primary-color)
  box-sizing: border-box

.stamp-picker-stamp-item-wrapper
  width: 32px
  height: 32px

  &:hover
    background-color: var(--background-hover-color)

.stamp-picker-stamp-item
  border-radius: 5px
  cursor: pointer
  background:
    size: contain
    repeat: no-repeat
    position: center center
  width: 28px
  height: 28px

.stamp-picker-stamp-item-dummy
  width: 32px
  height: 0

// .slide-left
//   &-enter-active
//     position: absolute
//     transition: all .2s ease

//   &-leave-active
//     position: absolute
//     transition: all .2s ease

//   &-enter
//     transform: translateX(-10px)
//     opacity: 0

//   &-leave-to
//     transform: translateX(10px)
//     opacity: 0

// .slide-right
//   &-enter-active
//     position: absolute
//     transition: all .2s ease

//   &-leave-active
//     position: absolute
//     transition: all .2s ease

//   &-enter
//     transform: translateX(10px)
//     opacity: 0

//   &-leave-to
//     transform: translateX(-10px)
//     opacity: 0
</style>
