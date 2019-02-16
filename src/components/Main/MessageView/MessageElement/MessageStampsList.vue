<template lang="pug">
transition-group.message-stamps-wrap(v-if="hasStamp" name="slide-in")
  div.stamp-container(
    v-for="stamp in stamps" 
    :key="stamp.stampId" 
    @click="toggleStamp(stamp.stampId)" 
    :title="stamp.title" 
    :class="{'stamp-pressed':isContainSelfStamp(stamp.stampId)}")
    div.stamp(:style="`background-image: url(${fileUrl(stamp.fileId)});`")
    p.stamp-number
      | {{stamp.sum}}
</template>

<script>
import client from '@/bin/client'
import { mapGetters } from 'vuex'
import IconStampPlus from '@/components/Icon/IconStampPlus'

export default {
  name: 'MessageStampsList',
  props: {
    stampList: {
      type: Array,
      required: true
    },
    messageId: {
      type: String,
      required: true
    }
  },
  components: {IconStampPlus},
  computed: {
    ...mapGetters([
      'fileUrl'
    ]),
    stamps () {
      const map = {}
      if (!this.stampList) {
        return []
      }
      this.stampList.forEach(stamp => {
        if (map[stamp.stampId]) {
          map[stamp.stampId].user.push({
            userId: stamp.userId,
            count: stamp.count
          })
          map[stamp.stampId].sum += stamp.count
          if (stamp.createdAt < map[stamp.stampId].createdAt) {
            map[stamp.stampId].createdAt = stamp.createdAt
          }
        } else {
          map[stamp.stampId] = {
            fileId: '',
            stampId: stamp.stampId,
            name: '',
            user: [{
              userId: stamp.userId,
              count: stamp.count
            }],
            sum: stamp.count,
            createdAt: stamp.createdAt
          }
          if (this.$store.state.stampMap[stamp.stampId]) {
            map[stamp.stampId].fileId = this.$store.state.stampMap[stamp.stampId].fileId
            map[stamp.stampId].name = this.$store.state.stampMap[stamp.stampId].name
          }
        }
      })
      Object.keys(map).forEach(key => {
        map[key].title = `:${map[key].name}: from`
        map[key].user.forEach(user => {
          map[key].title += ` ${this.$store.state.memberMap[user.userId].name}(${user.count})`
        })
      })
      const stamps = Object.values(map)
      stamps.sort((lhs, rhs) => {
        return new Date(lhs.createdAt).getTime() - new Date(rhs.createdAt).getTime()
      })
      return stamps
    },
    hasStamp () {
      return this.stamps.length > 0
    }
  },
  methods: {
    toggleStamp (stampId) {
      if (this.isContainSelfStamp(stampId)) {
        client.unstampMessage(this.messageId, stampId)
      } else {
        client.stampMessage(this.messageId, stampId)
      }
    },
    isContainSelfStamp (stampId) {
      return this.stamps
        .find(e => e.stampId === stampId).user
          .find(e => e.userId === this.$store.state.me.userId)
    }
  }
}
</script>

<style lang="sass">
.message-stamps-wrap
  display: inline-block
  margin:
    left: 10px
    top: 10px
  transition: height .3s ease

.stamp-container
  display: inline-flex
  align-items: center
  background: transparent
  color: $stamp-number-color
  padding: 2px 5px
  border:
    style: solid
    width: 1px
    color: $stamp-active-color
    radius: 3px
  margin:
    right: 4px
    bottom: 4px
  user-select: none
  cursor: pointer
  &.stamp-pressed
    background: $stamp-active-color
    color: $stamp-pressed-number-color

.slide-in
  &-enter-active, &-leave-active
    transition: all .3s ease
    transform: translateY(0)
  &-enter, &-leave-to
    transform: translateY(10px)
    opacity: 0
  &-leave-active
    position: absolute

.stamp-number
  line-height: 13px
  font-size: 13px
  margin: 0 3px

.stamp
  display: inline-block
  text-indent: 999%
  white-space: nowrap
  overflow: hidden
  color: transparent
  background-size: contain
  background-repeat: no-repeat
  background-position: center
  user-select: none
  width: 16px
  height: 16px
  .stamp-pressed &
    animation: stamp-pressed-anim .5s ease

@keyframes stamp-pressed-anim
  0%
    transform: scale(0.7)
  50%
    transform: scale(1.1)
  100%
    transform: scale(1)

.message-stamp-button
  display: inline-block
  margin: 0 5px 0
  color: #797979
  width: 20px
  height: 20px
  opacity: 0
  cursor: pointer
  .message-item:hover &
    opacity: 1
</style>



