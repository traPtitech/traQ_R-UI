<template lang="pug">
div.information-sidebar.drop-shadow(:class="sidebarClass")
  transition(name="information-transition" mode="out-in")
    div.information-sidebar-button(v-if="!isOpened" @click="openSidebar" key="close")
      div.online-users-number
        | {{onlineUsersNumber}}
    div.information-sidebar-content(v-else key="open")
      div.information-sidebar-online-users.separator-line(@click="closeSidebar" :class="{'drop-shadow': isScrolled}")
        div.online-information-container
          span.online-users-number
            | {{onlineUsersNumber}}
          span.online-users-number-text
            | ONLINE
        div.icon-close-wrap
          icon-close
      div.information-sidebar-content-scroller.is-scroll(ref="scroller")
        div.information-sidebar-content-item.separator-line(v-if="showQallSection")
          div.information-sidebar-content-header
            icon-call(size="24")
            span
              | QALL
            .indormation-sidebar-topic-edit-button(
              v-if="$store.getters['rtc/isCallingOnCurrentChannel']"
              :class="{ 'information-sidebar-action-cancel': isAdjustingCallVolumes }"
              :title="isAdjustingCallVolumes ? '音量を調整する' : 'キャンセル'"
              @click="toggleCallVolumeAdjust"
            )
              icon-check(v-if="isAdjustingCallVolumes")
              icon-volume(v-else)
          div.information-sidebar-content-body
            .information-sidebar-call-item(
              v-if="$store.getters['rtc/isCallingOnCurrentChannel']"
              :style="{ opacity: isAdjustingCallVolumes ? 0.5 : 1 }"
            )
              slim-member-element(:member="$store.state.me")
            .information-sidebar-call-item(v-for="id in callingMemberIdSet")
              calling-member-element(
                :member="$store.state.memberMap[id]"
                :adjustVolume="isAdjustingCallVolumes"
              )

        div.information-sidebar-content-item.separator-line(v-if="isChannel")
          div.information-sidebar-content-header
            icon-topic(size="24")
            span
              | TOPIC
            div.indormation-sidebar-topic-edit-button(:class="{'information-sidebar-action-cancel': isTopicEditing}" @click="toggleTopicEdit")
              icon-close(v-if="isTopicEditing")
              icon-edit(v-else)
              div.indormation-sidebar-topic-edit-button-text(v-if="isTopicEditing")
                | キャンセル
          div.information-sidebar-content-body(v-if="isTopicEditing")
            textarea.information-topic-edit-input(v-model="newTopic" rows="3")
            div.indormation-sidebar-topic-edit-confirm-button.flex-center(@click="updateTopic")
              | 更新
          div.information-sidebar-content-body(v-else)
            span(v-if="topic !== ''")
              | {{ topic }}
            span.no-topic(v-else)
              | 設定されていません
        div.information-sidebar-content-item.separator-line(v-if="hasPinnedMessage")
          div.information-sidebar-content-header
            icon-pin(size="24")
            span
              | PINNED
          div.information-sidebar-content-body
            template(v-for="p in pinnedMessages")
              slim-message-element(:message="p.message" :key="p.messageId")
        div.information-sidebar-content-item
          div(v-for="user in onlineUsers" :key="user.userId")
            slim-member-element(:member="user")
</template>

<script>
import IconClose from '@/components/Icon/IconClose'
import IconTopic from '@/components/Icon/IconTopic'
import IconPin from '@/components/Icon/IconPin'
import IconEdit from '@/components/Icon/IconEdit'
import IconVolume from '@/components/Icon/IconVolume'
import IconCall from '@/components/Icon/IconCall'
import IconCheck from '@/components/Icon/IconCheck'
import SlimMessageElement from '@/components/Main/MessageView/InformationSidebar/SlimMessageElement'
import SlimMemberElement from '@/components/Main/MessageView/InformationSidebar/SlimMemberElement'
import MemberElement from '@/components/Main/Sidebar/Content/MemberElement'
import CallingMemberElement from '@/components/Main/Rtc/CallingMemberElement'

export default {
  name: 'InformationSidebar',
  components: {
    IconClose,
    IconTopic,
    IconPin,
    IconEdit,
    IconVolume,
    IconCall,
    IconCheck,
    SlimMessageElement,
    SlimMemberElement,
    MemberElement,
    CallingMemberElement
  },
  data() {
    return {
      isOpened: false,
      isNotFirst: false,
      isScrolled: false,
      isTopicEditing: false,
      newTopic: '',
      isAdjustingCallVolumes: false
    }
  },
  computed: {
    route() {
      return this.$route
    },
    isUserDM() {
      return this.$route.params.user !== undefined
    },
    isChannel() {
      return this.$route.params.channel !== undefined
    },
    onlineUsersNumber() {
      return this.$store.state.heartbeatStatus.userStatuses.length
    },
    onlineUsers() {
      return this.$store.state.heartbeatStatus.userStatuses
    },
    currentChannelId() {
      return this.$store.state.currentChannel.channelId
    },
    topic() {
      if (this.$route.params.user) return ''
      return this.$store.getters.channelTopic(this.currentChannelId)
    },
    pinnedMessages() {
      return [...this.$store.state.currentChannelPinnedMessages].sort(
        (a, b) => {
          return new Date(a.dateTime) - new Date(b.dateTime)
        }
      )
    },
    hasPinnedMessage() {
      return this.pinnedMessages.length > 0
    },
    sidebarClass() {
      return {
        'is-opened': this.isOpened,
        'is-closed': this.isNotFirst && !this.isOpened
      }
    },
    callingMemberIdSet() {
      const heartbeatBased = this.$store.state.heartbeatStatus.userStatuses
        .filter(user => user.userId !== this.$store.state.me.userId)
        .filter(user => user.status === 'calling')
        .map(user => user.userId)
      const streamBased = this.$store.state.rtc.isCalling
        ? Object.keys(this.$store.state.rtc.remoteAudioStreamMap)
        : []
      return new Set(heartbeatBased.concat(streamBased))
    },
    showQallSection() {
      // コネクションが現在のチャンネルで開いている時か、現在のチャンネルで誰かが通話中のときは表示
      return (
        (this.$store.state.rtc.isActive &&
          this.$store.getters['rtc/isCallingOnCurrentChannel']) ||
        this.callingMemberIdSet.size > 0
      )
    }
  },
  methods: {
    openSidebar() {
      this.isOpened = true
    },
    closeSidebar() {
      this.isOpened = false
      this.isNotFirst = true
      this.isScrolled = false
    },
    handleScroll() {
      if (this.$refs.scroller.scrollTop > 0) {
        this.isScrolled = true
      } else {
        this.isScrolled = false
      }
    },
    toggleTopicEdit() {
      this.isTopicEditing = !this.isTopicEditing
    },
    async updateTopic() {
      await this.$store.dispatch('updateCurrentChannelTopic', this.newTopic)
      this.isTopicEditing = false
    },
    toggleCallVolumeAdjust() {
      this.isAdjustingCallVolumes = !this.isAdjustingCallVolumes
    },
    listen: function(target, eventType, callback) {
      if (!this._eventRemovers) {
        this._eventRemovers = []
      }
      target.addEventListener(eventType, callback)
      this._eventRemovers.push({
        remove: function() {
          target.removeEventListener(eventType, callback)
        }
      })
    }
  },
  created: function() {
    this.$nextTick(() => {
      this.listen(
        window,
        'click',
        function(e) {
          if (e.target.parentElement && !this.$el.contains(e.target)) {
            this.isOpened = false
          }
        }.bind(this)
      )
    })
  },
  destroyed: function() {
    if (this._eventRemovers) {
      this._eventRemovers.forEach(function(eventRemover) {
        eventRemover.remove()
      })
    }
  },
  watch: {
    route() {
      this.isTopicEditing = false
    },
    topic() {
      this.newTopic = this.topic
    }
  },
  mounted() {
    this.newTopic = this.topic
  }
}
</script>

<style lang="sass">
.information-sidebar
  position: absolute
  z-index: $information-sidebar-index
  width: $information-sidebar-button-width
  height: 60px
  cursor: pointer
  background: $tertiary-color
  overflow: hidden
  color: $text-light-color

  &.is-closed
    user-select: none
    +mq(pc)
      animation:
        name: close-info-sidebar-pc
    +mq(sp)
      animation:
        name: close-info-sidebar-sp
    animation:
      duration: .4s
      delay: 0s
      timing-function: ease-in

  &.is-opened
    cursor: auto
    +mq(pc)
      animation:
        name: open-info-sidebar-pc
    +mq(sp)
      animation:
        name: open-info-sidebar-sp
    animation:
      duration: .6s
      delay: 0s
      timing-function: ease
      fill-mode: forwards

  +mq(pc)
    right: 0
    top: 0
    width: $information-sidebar-button-width
    height: 60px
  +mq(sp)
    right: 0
    width: $information-sidebar-button-width
    height: 50px

@keyframes open-info-sidebar-pc
  0%
    width: $information-sidebar-button-width
    height: 60px
  40%
    width: $information-sidebar-width
    height: 60px
  100%
    width: $information-sidebar-width
    height: 100%

@keyframes open-info-sidebar-sp
  0%
    width: $information-sidebar-button-width
    height: 50px
  40%
    width: $information-sidebar-width
    height: 50px
  100%
    width: $information-sidebar-width
    height: 100%

@keyframes close-info-sidebar-pc
  0%
    width: $information-sidebar-width
    height: 100%
  60%
    width: $information-sidebar-width
    height: 60px
  100%
    width: $information-sidebar-button-width
    height: 60px

@keyframes close-info-sidebar-sp
  0%
    width: $information-sidebar-width
    height: 100%
  60%
    width: $information-sidebar-width
    height: 50px
  100%
    width: $information-sidebar-button-width
    height: 50px

.information-sidebar-button

  .online-users-number
    display: flex
    align-items: center
    justify-content: center
    +mq(pc)
      height: 60px
    +mq(sp)
      height: 50px
    color: white
    font-size: 20px

.information-sidebar-content
  height: 100%

.information-sidebar-content-scroller
  overflow-y: scroll
  +mq(pc)
    height: calc(100% - 60px)
  +mq(sp)
    height: calc(100% - 50px)

.information-sidebar-content-item
  margin:
    top: 12px
  padding:
    bottom: 12px
    left: 12px
    right: 12px

.information-sidebar-content-header
  display: flex
  align-items: center

  span
    font-weight: bold
    margin:
      left: 6px

.information-sidebar-content-body
  margin:
    top: 6px

  .no-topic
    opacity: 0.5

.information-sidebar-online-users
  display: flex
  align-items: center
  transition: all .5s
  cursor: pointer
  +mq(pc)
    height: 60px
  +mq(sp)
    height: 50px

  .online-users-number
    font-size: 24px

  .online-users-number-text
    font-weight: bold
    font-size: 18px
    padding:
      left: 6px

  .icon-close-wrap
    display: flex
    align-items: center
    height: 100%
    padding:
      left: 12px
      right: 12px
    margin:
      left: auto
    // cursor: pointer

.online-information-container
  display: flex
  align-items: center
  justify-content: center
  width: 100%
  padding:
    left: 12px

.information-transition-enter-active, .information-transition-leave-active
  transition: all .4s
  opacity: 1
.information-transition-enter, .information-transition-leave-to
  opacity: 0
  transform: translateX(-5px)

.separator-line
  position: relative

  &:before
    content: ''
    position: absolute
    margin: auto
    left: 0
    right: 0
    bottom: 0
    display: block
    width: calc(100% - 12px*2)
    height: 1px
    opacity: 0.5
    background: $light-bg-color

.indormation-sidebar-topic-edit-button
  position: relative
  margin-left: auto
  cursor: pointer
  display: flex
  align-items: center
  opacity: 0.5
  &:hover, &.information-sidebar-action-cancel
    opacity: 1

.indormation-sidebar-topic-edit-button-text
  font-size: 0.8rem
  margin-left: 0.5rem

.indormation-sidebar-topic-edit-confirm-button
  margin:
    top: 0.5rem
    left: auto
  width: 4rem
  height: 2.5rem
  border-radius: 4px
  border: 1px solid white
  cursor: pointer

.information-topic-edit-input
  overflow: auto
  background: none
  color: white
  border-radius: 3px
  border: 1px solid white
  padding: 0.25rem
  box-sizing: border-box
  width: 100%
</style>
