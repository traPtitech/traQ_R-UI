<template lang="pug">
article.message(v-if="!model.reported" ontouchstart="" :class="{'message-pinned':pinned}")
  .message-pin-detail(v-if="pinned")
    icon-pin(color="#F2994A")
    .message-pin-detail-text
      | {{ pinnerName }}さんがピン留めしました
  .message-user-icon-wrap
    .message-user-icon(
      :style="userIconBackground"
      @click="openUserModal(model.userId)")
  .message-detail-wrap
    .message-user-info-wrap
      .text-ellipsis.message-user-name(@click="openUserModal(model.userId)")
        | {{userDisplayName(model.userId)}}
      .message-user-status-badge(v-if="statusBadge(model.userId) !== undefined" @click="handleStatusClick")
        | {{statusBadge(model.userId)}}
      .text-ellipsis.message-user-id
        | @{{userName}}
    time.message-date
      .message-display-date-time
        | {{displayDateTime}}
      .message-edited-icon(v-if="isEdited")
        icon-pen(size="12" color="var(--text-color)")
    ul.message-buttons-wrap
      li(@click.stop="showStampPicker")
        icon-stamp-plus(size="20" color="var(--text-color)")
      li.message-button-drop-menu(@click.stop="activeDropMenu")
        icon-dots(size="18" color="var(--text-color)")
  .message-contents-wrap
    .message-text-wrap
      message-content-body(v-if="!isEditing" :content="model.content")
      .message-editing-wrap(v-if="isEditing")
        textarea.input-reset.edit-area(
          v-model="edited"
          ref="editArea"
          @beforeinput="editBeforeinput"
          @keydown="editKeydown"
          @keyup="editKeyup"
          @blur="editBlur")
        button.edit-button.edit-cancel(@click.stop="editCancel")
          | Cancel
        button.edit-button.edit-submit(@click.stop="editSubmit")
          | Edit
        .message-edit-key-guide(v-if="showKeyGuide")
          span(v-if="messageSendKey === 'modifier'")
            | + Enterを押して確定
          span(v-else)
            | + Enterを押して改行
    message-attachments(:attached="attachedData")
    message-stamps-list(:stampList="model.stampList" :messageId="model.messageId")
  .message-context-menu-on-pc.drop-shadow(v-if="isContextMenuActive")
    message-context-drop-menu(:userId="model.userId"
      :messageId="model.messageId"
      @deactive="isContextMenuActive = false"
      @pin="pinMessage"
      @unpin="unpinMessage"
      @edit="editMessage"
      @copy="copyMessage"
      @copy-md="copyMarkdown"
      @delete="deleteMessage"
      @report="reportMessage"
      )
</template>

<script>
import { mapGetters, mapState, mapActions } from 'vuex'
import autosize from 'autosize'
import {
  detectFiles,
  displayDateTime,
  withModifierKey,
  isModifierKey,
  isSendKeyInput,
  isBRKey,
  checkLevel2InputEventsSupport
} from '@/bin/utils'
import client from '@/bin/client'

import MessageContentBody from './MessageContentBody'
import MessageAttachments from './MessageAttachments'
import MessageStampsList from './MessageStampsList'
import MessageContextDropMenu from './MessageContextDropMenu'
import IconDots from '@/components/Icon/IconDots'
import IconPin from '@/components/Icon/IconPin'
import IconStampPlus from '@/components/Icon/IconStampPlus'
import IconPen from '@/components/Icon/IconPen'

const isLevel2InputEventsSupported = checkLevel2InputEventsSupport()

export default {
  name: 'MessageElement',
  props: {
    model: {
      type: Object,
      required: true
    }
  },
  components: {
    MessageContentBody,
    MessageAttachments,
    MessageStampsList,
    MessageContextDropMenu,
    IconDots,
    IconStampPlus,
    IconPin,
    IconPen
  },
  data() {
    return {
      isEditing: false,
      isContextMenuActive: false,
      isPushedModifierKey: false
    }
  },
  methods: {
    ...mapActions(['openUserModal']),
    detectFiles,
    activeDropMenu() {
      this.$store.commit('setActiveMessageContextMenu', this.model.messageId)
      this.isContextMenuActive = true
    },
    showStampPicker() {
      if (this.isEditing) {
        this.$store.commit('setStampPickerModeAsEdit')
      } else {
        this.$store.commit('setStampPickerModeAsMessage')
      }
      this.$store.commit('setStampPickerModel', {
        messageId: this.model.messageId
      })
      this.$store.commit('setStampPickerActive', true)
    },
    editBeforeinput(event) {
      if (isSendKeyInput(event, this.messageSendKey)) {
        event.preventDefault()
        this.editSubmit()
      }
    },
    editKeydown(event) {
      if (withModifierKey(event)) {
        this.isPushedModifierKey = true
      }
      // #945
      if (event.key === 'Enter' && !event.isComposing) {
        if (this.messageSendKey === 'modifier' && withModifierKey(event)) {
          event.preventDefault()
          this.editSubmit()
          return
        }
        if (
          this.messageSendKey === 'none' &&
          !withModifierKey(event) &&
          !isLevel2InputEventsSupported
        ) {
          event.preventDefault()
          this.editSubmit()
          return
        }
      }
      if (isBRKey(event, this.messageSendKey) && !event.isComposing) {
        event.preventDefault()
        const pre = this.edited.substring(0, this.$refs.editArea.selectionStart)
        const suf = this.edited.substring(this.$refs.editArea.selectionEnd)
        this.edited = `${pre}\n${suf}`
        this.$nextTick(() => {
          this.$refs.editArea.selectionStart = this.$refs.editArea.selectionEnd =
            pre.length + 1
          autosize.update(this.$refs.editArea)
        })
      }
    },
    editKeyup(event) {
      if (isModifierKey(event)) {
        this.isPushedModifierKey = false
      }
    },
    editMessage() {
      this.isEditing = true
      this.edited = this.model.content
      this.$nextTick().then(() => {
        this.$el.querySelector('textarea.input-reset.edit-area').focus()
      })
    },
    editSubmit() {
      if (this.edited === this.model.content) {
        this.isEditing = false
        return
      }
      client.editMessage(this.model.messageId, this.edited)
      this.edited = ''
      this.isEditing = false
      this.isPushedModifierKey = false
    },
    editCancel() {
      this.isEditing = false
    },
    deleteMessage() {
      if (window.confirm('このメッセージを削除してもよろしいですか？')) {
        client.deleteMessage(this.model.messageId)
      }
    },
    async pinMessage() {
      await client.pinMessage(this.model.messageId)
      this.$store.dispatch(
        'getCurrentChannelPinnedMessages',
        this.$store.state.currentChannel.channelId
      )
    },
    async unpinMessage() {
      await client.unpinMessage(this.pinned.pinId)
      this.$store.dispatch(
        'getCurrentChannelPinnedMessages',
        this.$store.state.currentChannel.channelId
      )
    },
    clipMessage() {
      client.clipMessage('', this.model.messageId)
    },
    copyMessage() {
      this.$copyText(
        `!{"raw":"","type":"message","id":"${this.model.messageId}"}`
      )
    },
    copyMarkdown() {
      this.$copyText(this.model.content)
    },
    reportMessage() {
      const reason = window.prompt(
        'このメッセージを不適切なメッセージとして通報しますか？\n通報理由を入力してください'
      )
      if (reason) {
        client.reportMessage(this.model.messageId, reason).then(() => {
          this.$store.commit('removeMessage', this.model.messageId)
        })
      }
    },
    grade() {
      return this.$store.getters.gradeByUserMap[this.model.userId]
    },
    statusBadge(userId) {
      // grade or bot or undefined
      if (this.isBot) {
        return 'bot'
      } else {
        return this.grade(userId) ? this.grade(userId).name : undefined
      }
    },
    handleStatusClick() {
      if (!this.isBot) {
        this.$store.dispatch(
          'openGroupModal',
          this.grade(this.model.userId).groupId
        )
      }
    },
    editBlur() {
      this.$store.commit('messageEdit/setSelect', {
        messageId: this.model.messageId,
        selectionEnd: this.$refs.editArea.selectionEnd
      })
    }
  },
  computed: {
    ...mapGetters(['fileUrl', 'getMyId', 'userDisplayName']),
    ...mapState(['messageSendKey']),
    showKeyGuide() {
      return (
        this.isPushedModifierKey &&
        !(this.messageSendKey === 'modifier' && !this.edited)
      )
    },
    userIconBackground() {
      return {
        backgroundImage: `url(${this.fileUrl(this.userDetail.iconFileId)})`
      }
    },
    userDetail() {
      return this.$store.state.memberMap[this.model.userId]
    },
    userName() {
      return this.userDetail.name
    },
    isBot() {
      return this.userDetail.bot
    },
    pinned() {
      return this.$store.getters.isPinned(this.model.messageId)
    },
    isEdited() {
      return this.model.createdAt !== this.model.updatedAt
    },
    edited: {
      get() {
        return this.$store.getters['messageEdit/edited'](this.model.messageId)
      },
      set(edited) {
        this.$store.commit('messageEdit/setEdited', {
          edited,
          messageId: this.model.messageId
        })
      }
    },
    displayDateTime() {
      return displayDateTime(this.model.createdAt, this.model.updatedAt)
    },
    pinDetail() {
      return (
        this.$store.state.currentChannelPinnedMessages.find(
          pin => pin.message.messageId === this.model.messageId
        ) || null
      )
    },
    pinnerName() {
      if (!this.pinDetail) {
        return ''
      }
      return this.$store.state.memberMap[this.pinDetail.userId].name
    },
    attachedData() {
      return detectFiles(this.model.content) || []
    }
  },
  watch: {
    isEditing(newValue) {
      if (newValue) {
        this.$nextTick(() => {
          autosize(this.$refs.editArea)
        })
      } else {
        autosize.destroy(this.$refs.editArea)
      }
    },
    edited() {
      autosize.update(this.$refs.editArea)
    }
  }
}
</script>

<style lang="sass">
.message
  display: grid
  grid-template-areas: "user-icon detail" "user-icon contents" "... contents"
  grid-template-rows: 20px 1fr
  grid-template-columns: 40px 1fr
  position: relative
  padding: 10px 10px
  width: 100%
  box-sizing: border-box
  &:hover
    background-color: var(--background-hover-color)
  &.message-pinned
    background-color: var(--pinned-message-color)
    grid-template-areas: "pin-detail pin-detail" "user-icon detail" "user-icon contents" "... contents"
    grid-template-rows: 1.5rem 20px 1fr
    grid-template-columns: 40px 1fr

.message-pin-detail
  display: none
  .message-pinned &
    padding: 0 0.25rem
    display: flex
    align-items: top
    grid-area: pin-detail

.message-pin-detail-text
  opacity: 0.8
  font-size: 0.8rem
  margin-left: 0.5rem

.message-user-icon-wrap
  grid-area: user-icon
  contain: content

.message-user-icon
  width: 40px
  height: 40px
  border-radius: 100%
  cursor: pointer
  background:
    size: cover
    repeat: no-repeat
    position: center center

.message-detail-wrap
  grid-area: detail
  display: flex
  justify-content: space-between
  align-items: center
  min-width: 0
  contain: content

.message-user-info-wrap
  display: flex
  align-items: baseline
  width: calc(100% - 110px)

.message-user-name
  color: var(--bold-text-color)
  margin: 0 0 0 10px
  font-weight: bold
  text-align: left
  max-width: 60%
  line-height: 1.5em
  overflow: hidden
  cursor: pointer
  flex-shrink: 0

.message-user-status-badge
  border:
    style: solid
    width: 1px
    radius: 3px
  font:
    weight: bold
    size: 12px
  line-height: 12px
  padding: 1px 2px 1px
  margin:
    left: 5px
  opacity: 0.8
  cursor: pointer

.message-user-id
  opacity: 0.6
  margin-left: 5px
  font-size: 0.8em
  line-height: 1.3em
  max-width: 40%

.message-date
  display: flex
  align-items: center
  font-size: 0.7em
  margin-left: 5px
  .message:hover &
    display: none

.message-edited-icon
  opacity: 0.8
  margin-left: 4px

.message-contents-wrap
  /* https://qiita.com/mpyw/items/dfc63c1fed5dfc5eda26 */
  min-width: 0
  grid-area: contents
  display: flex
  flex-flow: column
  contain: contents

.message-content > p:not(:last-child)
  magin-bottom: 1em

.message-text-wrap
  margin: 0 0 0 10px
  padding: 5px 0 0
  text-align: left
  font-size: 0.9em
  word-break: break-word
  word-wrap: break-word
  line-break: loose
  text-align: justify
  & pre
    white-space: pre-wrap

.message-actions-wrap
  display: flex
  justify-content: space-between
  margin: 10px 0 5px

.message-buttons-wrap
  transition: all .2s ease
  display: none
  justify-content: flex-end

  .message:hover &
    display: flex
    align-items: center

  & li
    margin: 0 5px
    cursor: pointer
    display: flex
    height: 20px
    align-items: center
    opacity: 0.6

  & li:hover
    opacity: 1

.message-user-link
  cursor: pointer
  color: #005BAC
  font-weight: bold

.message-user-link-highlight
  background-color: #FAFFAD

.message-channel-link

.message-group-link
  cursor: pointer
  color: #005BAC
  font-weight: bold

.message-group-link-highlight
  background-color: #FAFFAD

.edit-area
  width: 100%
  resize: none
  background-color: #d0d0d0
  padding: 10px
  box-sizing: border-box
  max-height: 240px

.edit-button
  border: none
  color: white
  padding: 3px 10px
  cursor: pointer
  margin: 2px 5px 0 0

.edit-cancel
  background-color: #888888

.edit-submit
  background-color: #4e72d6

@keyframes rotate
  0%
    transform: rotate(0)
  100%
    transform: rotate(1turn)

@keyframes rotate-inv
  0%
    transform: rotate(0)
  100%
    transform: rotate(-1turn)

@keyframes wiggle
  0%
    transform: translate(1px, 1px) rotate(0deg)
  10%
    transform: translate(-1px, -2px) rotate(-1deg)
  20%
    transform: translate(-3px, 0px) rotate(1deg)
  30%
    transform: translate(3px, 2px) rotate(0deg)
  40%
    transform: translate(1px, -1px) rotate(1deg)
  50%
    transform: translate(-1px, 2px) rotate(-1deg)
  60%
    transform: translate(-3px, 1px) rotate(0deg)
  70%
    transform: translate(3px, 1px) rotate(-1deg)
  80%
    transform: translate(-1px, -1px) rotate(1deg)
  90%
    transform: translate(1px, 2px) rotate(0deg)
  100%
    transform: translate(1px, -2px) rotate(-1deg)

@keyframes parrot
  0%
    filter: hue-rotate(0)
  100%
    filter: hue-rotate(1turn)

@keyframes zoom
  0%
    transform: scale(1.0)
  25%
    transform: scale(1.5)
  50%
    transform: scale(1.0)
  75%
    transform: scale(0.5)

@keyframes invert
  0%
    filter: invert(0)
  50%
    filter: invert(1)

@keyframes turn
  0%
    transform: rotateY(0)
  100%
    transform: rotateY(1turn)

@keyframes turn-v
  0%
    transform: rotateX(0)
  100%
    transform: rotateX(1turn)

@keyframes happa
  $len: 8
  @for $i from 0 to $len
    $y: 0
    @if $i % 2 != 0
      $y: -0.2em

    $r: 0
    @if $i >= ($len / 2)
      $r: 0.5turn

    #{percentage($i / $len)}
      transform: translateY($y) rotateY($r)

@keyframes pyon
  0%
    transform: translateY(0) scale(1, 1)
  30%
    transform: translateY(-0.2em) scale(1, 1)
  60%
    transform: translateY(0) scale(1, 1)
  80%
    transform: translateY(0) scale(1.1, 0.9)

@keyframes flashy
  $len: 10
  @for $i from 0 to $len
    #{percentage($i / $len)}
      filter: drop-shadow(0 0 0.2em hsl($i / $len * 360, 50%, 50%))

@keyframes pull
  0%
    transform: skew(0, 0)
  25%
    transform: skew(15deg, 15deg)
  50%
    transform: skew(0, 0)
  75%
    transform: skew(-15deg, -15deg)

@keyframes atsumori
  0%
    transform: scale(2)
    filter: blur(0.3em) opacity(0) saturate(0.4) drop-shadow(0 0 0 rgba(136,136,136,0))
  15%
    transform: scale(1)
    filter: blur(0) opacity(1) saturate(0.4) drop-shadow(0 0 0 rgba(136,136,136,0))
  20%
    transform: scale(1.3)
    filter: blur(0) opacity(1) saturate(1) drop-shadow(0 0 0 rgba(136,136,136,0))
  25%
    transform: scale(1)
    filter: blur(0) opacity(1) saturate(1.5) drop-shadow(-0.1em -0.1em 0.3em rgba(136,136,136,0.5))
  35%
    transform: scale(1)
    filter: blur(0) opacity(1) saturate(1.5) drop-shadow(-0.5em -0.5em 0 rgba(136,136,136,0))
  100%
    transform: scale(1)
    filter: blur(0) opacity(1) saturate(1.5) drop-shadow(0 0 0 rgba(136,136,136,0))

@keyframes stretch
  0%
    transform: scaleX(1.0)
  20%
    transform: scaleX(1.75)

  $start: 22
  $end: 50
  @for $i from 0 through ($end - $start) / 2
    $s: 1.65
    @if $i % 2 != 0
      $s: 1.85

    #{$start + $i*2}%
      transform: scaleX($s)

  52%
    transform: scaleX(1.75)
  62%
    transform: scaleX(0.8)
  68%
    transform: scaleX(1.0)

@keyframes stretch-v
  0%
    transform: scaleY(1.0)
  20%
    transform: scaleY(1.75)

  $start: 22
  $end: 50
  @for $i from 0 through ($end - $start) / 2
    $s: 1.65
    @if $i % 2 != 0
      $s: 1.85

    #{$start + $i*2}%
      transform: scaleY($s)

  52%
    transform: scaleY(1.75)
  62%
    transform: scaleY(0.8)
  68%
    transform: scaleY(1.0)

@keyframes conga
  0%
    background-position-x: 0
  100%
    background-position-x: 1em

@keyframes conga-inv
  0%
    background-position-x: 0
  100%
    background-position-x: -1em

@keyframes rainbow
  @for $i from 0 to 5
    #{$i * 20}%
      // 赤
      filter: invert(1 - abs(1 - 0.4 * $i)) grayscale(1) brightness(0.4) sepia(1) hue-rotate(310deg) saturate(6) contrast(0.8)
    #{$i * 20 + 1.528*2}%
      // 黄
      filter: invert(1 - abs(1 - 0.4 * ($i + 0.1528*2))) grayscale(1) brightness(0.7) sepia(1) hue-rotate(5deg) saturate(5) contrast(0.7)
    #{$i * 20 + 2.778*2}%
      // 緑
      filter: invert(1 - abs(1 - 0.4 * ($i + 0.2778*2))) grayscale(1) brightness(0.4) sepia(1) hue-rotate(50deg) saturate(10) contrast(0.8)
    #{$i * 20 + 6.389*2}%
      // 青
      filter: invert(1 - abs(1 - 0.4 * ($i + 0.6389*2))) grayscale(1) brightness(0.3) sepia(1) hue-rotate(180deg) saturate(7) contrast(0.8)
  100%
    // 赤
    filter: invert(0) grayscale(1) brightness(0.4) sepia(1) hue-rotate(310deg) saturate(6) contrast(0.8)

.emoji
  display: inline-block
  text-indent: 999%
  white-space: nowrap
  overflow: hidden
  color: transparent
  background-size: contain
  background-repeat: no-repeat
  background-position: center center
  vertical-align: middle

.emoji-effect
  display: inline-block
  vertical-align: middle

.emoji
  width: 1em
  height: 1em
  &.s24
    font-size: 24px
  &.s32
    font-size: 32px
  &.ex-large
    font-size: 48px
  &.large
    font-size: 32px
  &.small
    font-size: 16px

#app:not([data-eco-mode="true"]) .emoji-effect
  line-height: 0

  font-size: 24px
  &.ex-large
    font-size: 48px
  &.large
    font-size: 32px
  &.small
    font-size: 16px
  .emoji-effect
    font-size: inherit

  &.rotate
    animation: rotate linear 1s infinite
  &.rotate-inv
    animation: rotate-inv linear 1s infinite
  &.wiggle
    animation: wiggle linear 0.3s infinite
  &.parrot
    animation: parrot linear 0.5s infinite
  &.zoom
    animation: zoom linear 1s infinite
  &.inversion
    animation: invert linear 1.5s infinite
  &.turn
    animation: turn linear 1.5s infinite
  &.turn-v
    animation: turn-v linear 1.5s infinite
  &.happa
    animation: happa linear 1.5s infinite
  &.pyon
    animation: pyon linear 0.75s infinite
    transform-origin: bottom center
  &.flashy
    animation: flashy linear 1s infinite
  &.pull
    animation: pull linear 0.5s infinite
  &.atsumori
    animation: atsumori linear 2s infinite
  &.stretch
    animation: stretch linear 1s infinite
  &.stretch-v
    animation: stretch-v linear 1s infinite

  $s: ".conga"
  @for $i from 1 through 5
    &#{$s} .emoji
      background-repeat: repeat-x
      animation: conga linear #{1 / $i}s infinite
    $s: #{$s ".conga"}

  $s: ".conga-inv"
  @for $i from 1 through 5
    &#{$s} .emoji
      background-repeat: repeat-x
      animation: conga-inv linear #{1 / $i}s infinite
    $s: #{$s ".conga-inv"}

  &.rainbow
    animation: rainbow linear 3s infinite

.message-button-drop-menu
  transform: rotate(90deg)

.message-edit-key-guide
  position: absolute
  opacity: 0.6
  right: 10px
  bottom: 20px
  font:
    size: 0.8em
</style>
