<template lang="pug">
  ul(@click.passive="$emit('deactive')")
    li(@click="$emit('unpin')" v-if="pinned")
      | ピン留めを外す
    li(@click="$emit('pin')" v-else)
      | ピン留め
    li(v-if="userId === getMyId" @click="$emit('edit')")
      | 編集
    li(v-if="!isDirectMessage" @click="$emit('copy')")
      | 引用
    //- li(@click="clipMessae")
    //-   | クリップ
    li(v-if="userId === getMyId" @click="$emit('delete')")
      | 削除
    li(@click="$emit('report')")
      | 報告
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'MessageContextDropMenu',
  props: {
    userId: {
      type: String,
      required: true
    },
    messageId: {
      type: String,
      required: true
    }
  },
  computed: {
    ...mapGetters([
      'getMyId'
    ]),
    isDirectMessage () {
      if (this.$store.state.currentChannel.channelId === this.$store.state.directMessageId) return true
      if (this.$store.state.currentChannel.member) return true
      return false
    },
    pinned () {
      return this.$store.getters.isPinned(this.messageId)
    }
  },
  methods: {
    listen: function (target, eventType, callback) {
      if (!this._eventRemovers) {
        this._eventRemovers = []
      }
      target.addEventListener(eventType, callback)
      this._eventRemovers.push({
        remove: function () {
          target.removeEventListener(eventType, callback)
        }
      })
    }
  },
  created: function () {
    this.listen(window, 'click', function (e) {
      if (!this.$el.contains(e.target)) {
        this.$emit('deactive')
      }
    }.bind(this))
  },
  destroyed: function () {
    if (this._eventRemovers) {
      this._eventRemovers.forEach(function (eventRemover) {
        eventRemover.remove()
      })
    }
  }
}
</script>

<style lang="sass">
.message-context-menu-on-pc
  position: absolute
  background: var(--background-color)
  right: 10px
  top: 14px
  padding: 4px 0 4px
  border-radius: 4px
  min-width: 100px
  z-index: $message-context-menu-index

  li
    cursor: pointer
    margin:
      bottom: 2px
    padding: 4px 15px 4px

    &:hover
      background: var(--background-hover-color)
</style>
