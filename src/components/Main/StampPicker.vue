<template lang="pug">
div.stamp-picker
  transition(name="stamp-picker")
    modal(:active="active" @close="closeStampPicker")
      div.stamp-picker-container
        div.stamp-picker-header
          input.stamp-picker-search(v-model="search" :placeholder="searchPlaceHolder")
          div.stamp-picker-search-icon
            icon(name="search")
        div.stamp-picker-body
          div.emoji-container(v-if="" @mouseleave="searchPlaceHolder=defaultString")
            div(v-for="(category, idx) in $store.state.stampCategolized")
              div(v-show="idx==currentCategoryIndex || search")
                p
                  | {{category.category}}
                div.emoji-item(v-for="stamp in stamps(idx)" class="emoji s32" @click="addStamp(stamp.id)" @mouseover="hoverStamp(stamp.name)" :style="`background-image: url(${$store.state.baseURL}/api/1.0/files/${$store.state.stampMap[stamp.id].fileId})`" :title="`:${stamp.name}:`")
        div.stamp-picker-footer
            div.stamp-category-wrap
              div.stamp-category-item(v-for="(category,idx) in $store.state.stampCategolized" :style="category.stamps[0] ? `background-image: url(${$store.state.baseURL}/api/1.0/files/${$store.state.stampMap[category.stamps[0].id].fileId})` : ''" @click="currentCategoryIndex=idx")
</template>

<script>
import client from '@/bin/client'

export default {
  name: 'StampPicker',
  props: {
  },
  created () {
    this.searchPlaceHolder = this.defaultString
  },
  computed: {
    active () {
      return this.$store.state.stampPickerActive
    },
    model () {
      return this.$store.state.stampPickerModel
    }
  },
  data () {
    return {
      search: '',
      defaultString: 'スタンプを検索',
      searchPlaceHolder: this.defaultString,
      loaded: false,
      currentCategoryIndex: 0
    }
  },
  methods: {
    addStamp (stampId) {
      client.stampMessage(this.model.messageId, stampId)
    },
    closeStampPicker () {
      this.$store.commit('inactiveStampPicker')
    },
    stamps (index) {
      if (this.search === '') {
        return this.$store.state.stampCategolized[index].stamps
      }
      return this.$store.state.stampCategolized[index].stamps.filter(stamp => stamp.name.includes(this.search))
    },
    hoverStamp (name) {
      this.searchPlaceHolder = name
    },
    emojiLoaded () {
      this.loaded = true
    }
  }
}
</script>

<style lang="sass">
@import "~@/styles/global.sass"
.stamp-picker
  .modal-overlay
    background: none
  .modal
    max-width: 300px
    width: 100%
    right: 0
    +mq(pc)
      right: 50px
    bottom: 60px
    transition: all .2s ease-out
.stamp-picker-enter .modal, .stamp-picker-leave-active .modal
  transform: translateY(100%)
.stamp-picker-enter-active, .stamp-picker-leave-active
.stamp-picker-header
  background: $primary-color
  position: relative
.stamp-picker-search
  outline: none
  border: none
  box-sizing: border-box
  width: calc( 100% - 10px*2 )
  height: 30px
  margin: 10px 10px 10px
  padding: 5px 5px
.stamp-picker-search-icon
  display: inline-block
  color: gray
  position: absolute
  top: 50%
  right: 20px
  transform: translateY(-50%)
.stamp-category-wrap
  display: flex
  padding: 0
.stamp-category-item
  width: 20px
  height: 20px
  background-size: contain
  background-repeat: none
  margin: 5px
  cursor: pointer
.stamp-picker-body
  overflow-y: scroll
  height: 40vh
.stamp-picker-footer
.emoji-item
  border-radius: 5px
  cursor: pointer
  &:hover
    background-color: gray
.emoji.s32
  width: 32px
  height: 32px
.emoji
  display: inline-block
  text-indent: 999%
  white-space: nowrap
  overflow: hidden
  color: transparent
  background-size: contain
</style>

