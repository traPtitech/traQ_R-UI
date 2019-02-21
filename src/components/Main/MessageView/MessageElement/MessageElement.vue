<template lang="pug">
div.message(ontouchstart="" :class="{'message-pinned':pinned}" @click="$emit('close')" v-if="!model.reported" v-show="rendered")
  div.message-user-icon-wrap
    img.message-user-icon(:src="userIconSrc(model.userId)" @click="openUserModal(model.userId)")
  div.message-detail-wrap
    div.message-user-info-wrap
      div.text-ellipsis.message-user-name(@click="openUserModal(model.userId)")
        | {{userDisplayName(model.userId)}}
      div.message-user-status-badge(v-if="statusBadge(model.userId) !== undefined")
        | {{statusBadge(model.userId)}}
      div.text-ellipsis.message-user-id(@click="openUserModal(model.userId)")
        | @{{userName}}
    time.message-date
      | {{displayDateTime}}
    ul.message-buttons-wrap
      li(@click="showStampPicker")
        icon-stamp-plus(:size="20" color="var(--text-color)")
      li(@click.stop="isContextMenuActive = true")
        icon-dots(:size="18" color="var(--text-color)")
  div.message-contents-wrap
    div.message-text-wrap
      component(v-if="!isEditing" :is="renderedText" v-bind="$props")
      div(v-if="isEditing")
        textarea.input-reset.edit-area(v-model="edited")
        button.edit-button.edit-cancel(@click.stop="editCancel" )
          | Cancel
        button.edit-button.edit-submit(@click.stop="editSubmit" )
          | Edit
    message-attached-messages(v-if="hasAttachedMessage" :messages="messages")
    message-attached-files(v-if="hasAttachedFile" :files="files")
    message-stamps-list(:stampList="model.stampList" :messageId="model.messageId")
  div.message-context-menu-on-pc.drop-shadow(v-if="isContextMenuActive")
    message-context-drop-menu(:userId="model.userId" 
      :messageId="model.messageId" 
      @deactive="isContextMenuActive = false" 
      @pin="pinMessage" 
      @unpin="unpinMessage" 
      @edit="editMessage" 
      @copy="copyMessage" 
      @delete="deleteMessage" 
      @report="reportMessage"
      )
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { detectFiles, displayDateTime } from '@/bin/utils'
import md from '@/bin/markdown-it'
import client from '@/bin/client'
import MessageAttachedMessages from './MessageAttachedMessages'
import MessageAttachedFiles from './MessageAttachedFiles'
import MessageStampsList from './MessageStampsList'
import MessageContextDropMenu from './MessageContextDropMenu'
import IconDots from '@/components/Icon/IconDots'
import IconStampPlus from '@/components/Icon/IconStampPlus'

export default {
  name: 'MessageElement',
  props: {
    model: Object
  },
  components: {
    MessageAttachedMessages, MessageAttachedFiles, MessageStampsList, MessageContextDropMenu, IconDots, IconStampPlus
  },
  data () {
    return {
      isEditing: false,
      edited: '',
      files: [],
      messages: [],
      rendered: false,
      isContextMenuActive: false
    }
  },
  methods: {
    ...mapActions(['openUserModal']),
    detectFiles,
    userIconSrc: client.getUserIconUrl,
    showStampPicker () {
      this.$store.commit('setStampPickerModel', {messageId: this.model.messageId})
      this.$store.commit('activeStampPicker')
    },
    editMessage () {
      this.isEditing = true
      this.edited = this.model.content
    },
    editSubmit () {
      if (this.edited === this.model.content) {
        this.isEditing = false
        return
      }
      client.editMessage(this.model.messageId, this.edited)
      this.isEditing = false
      this.getAttachments()
    },
    editCancel () {
      this.isEditing = false
    },
    deleteMessage () {
      if (window.confirm('このメッセージを削除してもよろしいですか？')) {
        client.deleteMessage(this.model.messageId)
      }
    },
    async pinMessage () {
      await client.pinMessage(this.model.messageId)
      this.$store.dispatch('getCurrentChannelPinnedMessages', this.$store.state.currentChannel.channelId)
    },
    async unpinMessage () {
      await client.unpinMessage(this.pinned.pinId)
      this.$store.dispatch('getCurrentChannelPinnedMessages', this.$store.state.currentChannel.channelId)
    },
    clipMessage () {
      client.clipMessage('', this.model.messageId)
    },
    async getAttachments () {
      const data = detectFiles(this.model.content)
      this.files = (await Promise.all(data.filter(e => e.type === 'file').map(async e => {
        return client.getFileMeta(e.id)
        .then(res => res.data)
        .catch(e => {
          return {
            fileId: '',
            name: 'not found',
            mime: 'none',
            size: 0,
            dateTime: '2019-02-05T05:43:00.452Z',
            hasThumb: true,
            thumbWidth: 0,
            thumbHeight: 0
          }
        })
      })))
      this.messages = (await Promise.all(data.filter(e => e.type === 'message').map(async e => {
        return client.getMessage(e.id)
          .then(res => res.data)
          .catch(e => null)
      }))).filter(e => e)
      this.rendered = true

      await this.$nextTick()
      while (!this.$el) {
        await this.$nextTick()
      }
      this.$el.parentElement.parentElement.parentElement.scrollTop += this.$el.scrollHeight
    },
    mark (text) {
      return {
        template: `<div class="message-content" v-pre>${md.render(text)}</div>`,
        props: this.$options.props
      }
    },
    copyMessage () {
      const body = document.body
      if (!body) return
      const textarea = document.createElement('textarea')
      textarea.value = `!{"raw":"","type":"message","id":"${this.model.messageId}"}`
      body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      body.removeChild(textarea)
    },
    reportMessage () {
      const reason = window.prompt('このメッセージを不適切なメッセージとして通報しますか？\n通報理由を入力してください')
      if (reason) {
        client.reportMessage(this.model.messageId, reason)
        .then(() => {
          this.$store.commit('removeMessage', this.model.messageId)
        })
      }
    },
    isBot (userId) {
      return this.$store.state.memberMap[userId].bot
    },
    grade (userId) {
      return this.$store.getters.gradeByUserMap[this.model.userId]
    },
    statusBadge (userId) {
      // grade or bot or undefined
      if (this.isBot(userId)) {
        return 'bot'
      } else {
        return this.grade(userId)
      }
    }
  },
  computed: {
    ...mapGetters([
      'fileUrl', 'getMyId', 'userDisplayName'
    ]),
    userName () {
      return this.$store.state.memberMap[this.model.userId].name
    },
    renderedText () {
      return this.mark(this.model.content)
    },
    pinned () {
      return this.$store.getters.isPinned(this.model.messageId)
    },
    isEdited () {
      return this.model.createdAt !== this.model.updatedAt
    },
    displayDateTime () {
      return displayDateTime(this.model.createdAt, this.model.updatedAt)
    },
    hasAttachedMessage () {
      return this.messages.length > 0
    },
    hasAttachedFile () {
      return this.files.length > 0
    }
  },
  mounted () {
    this.getAttachments()
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

.message-user-icon-wrap
  grid-area: user-icon

.message-user-icon
  width: 40px
  height: 40px
  border-radius: 100%
  cursor: pointer

.message-detail-wrap
  grid-area: detail
  display: flex
  justify-content: space-between
  align-items: center
  min-width: 0

.message-user-info-wrap
  display: flex
  align-items: center
  width: calc(100% - 110px)

.message-user-name
  margin: 0 0 0 10px
  font-weight: bold
  text-align: left
  max-width: 60%
  height: 20px
  line-height: 20px
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

.message-user-id
  opacity: 0.6
  margin-left: 5px
  font-size: 0.8em
  max-width: 40%
  cursor: pointer

.message-date
  display: block
  font-size: 0.7em
  margin-left: 5px
  .message:hover &
    display: none

.message-contents-wrap
  grid-area: contents
  display: flex
  flex-flow: column

.message-text-wrap
  margin: 0 0 0 10px
  padding: 5px 0 0
  text-align: left
  font-size: 0.9em
  word-break: break-all
  word-wrap: break-word
  line-break: loose
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

.emoji
  &.s24
    width: 24px
    height: 24px
  &.s32
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
