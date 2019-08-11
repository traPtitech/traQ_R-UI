<template lang="pug">
.message-input(:class="{'input-focused':focused}")
  transition(name="typing-slide-in")
    message-typing-users(v-if="isAnyoneTyping" :typingUsers="typingUsers")
  .message-input-key-guide(v-if="showKeyGuide")
    span(v-if="messageSendKey === 'modifier'")
      | + Enterを押して送信
    span(v-else)
      | + Enterを押して改行
  input.upload-button(id="upload" style="display:none" type="file" multiple="multiple" @change="addFiles")
  .message-input-body
    .message-input-progress-bar(:style="{'width': uploadProgress * 100 + '%'}")
    .message-input-buttons-wrapper
      .message-input-button.flex-center(@click="clickUploadButton")
        icon-upload(size="24" color="var(--tertiary-color-on-bg)")
      .message-input-button.flex-center(@click.stop="showStampPicker")
        icon-stamp(size="24" color="var(--tertiary-color-on-bg)")
      //- .message-input-button.flex-center
      //-   icon-hash(size="22" color="var(--tertiary-color-on-bg)")
      //- .message-input-button.flex-center
      //-   icon-profile(size="24" color="var(--tertiary-color-on-bg)")
    .message-input-files-wrapper.is-scroll(v-if="hasFile")
      .message-input-file(v-for="(file, index) in files")
        .message-input-file-thumbnail(
          v-if="file.thumbnail"
          :style="{backgroundImage: `url(${file.thumbnail})`}")
        .message-input-file-icon.flex-center(v-else)
          icon-file(size="24" color="var(--tertiary-color-on-bg)")
        span.message-input-file-name.text-ellipsis
          | {{ file.file.name }}
        .message-input-file-close-button(@click="removeFile(index)")
          icon-close(size="18" color="var(--tertiary-color-on-bg)")
    .message-input-text-area-wrapper
      .message-input-button.flex-center(@click="clickUploadButton")
        icon-upload(size="24" color="var(--tertiary-color-on-bg)")
      textarea#message-input-text-area.input-reset(
        rows="1"
        :placeholder="placeholder"
        v-model="inputText"
        @focus="inputFocus"
        @blur="inputBlur"
        @beforeinput="beforeinput"
        @input="input"
        @keydown="keydown"
        @keyup="keyup"
        @paste="pasteImage"
        ref="inputArea")
      .message-input-button.flex-center(@click.stop="showStampPicker")
        icon-stamp(size="24" color="var(--tertiary-color-on-bg)")
      .message-input-send-button.flex-center(
        @click="submit"
        :style="sendButtonStyle")
        icon-send(size="24" color="var(--tertiary-color-on-bg)")
  //-   p.suggest-element(v-for="(suggest, id) in suggests" @click="replaceSuggest(id)" @mouseover="onmouseover(id)" :style="(suggestMode && suggestIndex === id) ? 'background-color: rgb(255, 255, 0);' : ''" v-html="suggest.html")
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import autosize from 'autosize'
import client from '@/bin/client'
import {
  isImage,
  withModifierKey,
  isModifierKey,
  isSendKeyInput,
  isBRKey,
  checkLevel2InputEventsSupport
} from '@/bin/utils'
import suggest from '@/bin/suggest'
import stampAltNameTable from '@/bin/emoji_altname_table.json'
import MessageTypingUsers from './MessageTypingUsers'
import IconSend from '@/components/Icon/IconSend'
import IconUpload from '@/components/Icon/IconUpload'
import IconStamp from '@/components/Icon/IconStamp'
import IconHash from '@/components/Icon/IconHash'
import IconProfile from '@/components/Icon/IconProfile'
import IconFile from '@/components/Icon/IconFile'
import IconClose from '@/components/Icon/IconClose'

const isLevel2InputEventsSupported = checkLevel2InputEventsSupport()

export default {
  name: 'MessageInput',
  components: {
    MessageTypingUsers,
    IconSend,
    IconUpload,
    IconStamp,
    IconHash,
    IconProfile,
    IconFile,
    IconClose
  },
  data() {
    return {
      focused: false,
      // postStatus: {'default', 'processing', 'succeeded', 'failed'}
      postStatus: 'default',
      postLock: false,
      uploadedIds: [],
      messageInput: null,
      uploadProgressSum: 0,
      isPushedModifierKey: false
    }
  },
  created() {
    this.$store.subscribe((mutation, state) => {
      if (mutation.type === 'setFiles') {
        this.dropFile(state.files)
        this.$store.commit('clearFiles')
      }
    })
  },
  methods: {
    isImage,
    inputFocus() {
      this.focused = true
    },
    inputBlur() {
      this.focused = false
      this.$store.commit('setEditing', false)
    },
    submit() {
      if (this.postLock || !this.canSubmit) {
        return
      }
      if (this.$store.state.currentChannel.force) {
        if (
          !window.confirm(
            'このチャンネルに投稿されたメッセージは全員に通知されます。メッセージを投稿しますか？'
          )
        ) {
          return
        }
      }
      this.postLock = true
      if (this.files.length > 0) {
        this.uploadFiles()
          .then(() => {
            this.files = []
            this.postMessage()
          })
          .catch(err => {
            console.log(err)
            this.postStatus = 'failed'
            this.postLock = false
          })
      } else {
        this.postMessage()
      }
    },
    postMessage() {
      this.postStatus = 'processing'
      let nowChannel = this.$store.state.currentChannel
      let message = this.inputText
      // temporary format
      this.uploadedIds.forEach(id => {
        message += `\n!{"type": "file", "raw": "", "id": "${id}"}`
      })
      this.uploadedIds = []
      let inCodeBlock = false
      message = message
        .split('\n')
        .map(line => {
          if (/^```/.test(line)) {
            inCodeBlock = !inCodeBlock
          }
          if (!inCodeBlock) {
            let inQuote = false
            return line
              .split('`')
              .map(s => {
                if (inQuote) {
                  inQuote = false
                  return s
                } else {
                  inQuote = true
                  return this.replaceStampAltName(
                    this.replaceGroup(this.replaceChannel(this.replaceUser(s)))
                  )
                }
              })
              .join('`')
          } else {
            return line
          }
        })
        .join('\n')
      const postedMessage = !nowChannel.dm
        ? client.postMessage(nowChannel.channelId, message)
        : client.postDirectMessage(
            this.$store.getters.getUserIdByDirectMessageChannel(nowChannel),
            message
          )
      postedMessage
        .then(() => {
          this.inputText = ''
          this.postStatus = 'succeeded'
          this.postLock = false
        })
        .catch(() => {
          this.postStatus = 'failed'
          this.postLock = false
        })
    },
    replaceUser(message) {
      return message.replace(/[@＠]([a-zA-Z0-9+_-]{1,32})/g, (match, name) => {
        const user = this.$store.getters.getUserByName(name)
        if (user) {
          return `!{"type": "user", "raw": "${match}", "id": "${user.userId}"}`
        } else {
          return match
        }
      })
    },
    replaceChannel(message) {
      return message.replace(/[#＃]([a-zA-Z0-9_/-]+)/g, (match, name) => {
        const channel = this.$store.getters.getChannelByName(name)
        if (channel) {
          return `!{"type": "channel", "raw": "${match}", "id": "${
            channel.channelId
          }"}`
        } else {
          return match
        }
      })
    },
    replaceGroup(message) {
      return message.replace(
        /"[@＠]([\S]+)|(?:[@＠]([\S]+))/g,
        (match, replacedUsername, content) => {
          // すでにユーザーへのメンションに置換されているときは置換を行わない
          if (replacedUsername) return match
          const group = this.$store.getters.getGroupByContent(content)
          if (group) {
            return `!{"type": "group", "raw": "${match}", "id": "${
              group.groupId
            }"}`
          } else {
            return match
          }
        }
      )
    },
    replaceStampAltName(message) {
      return message.replace(/:([a-zA-Z0-9+_-]{1,32}):/g, (match, altName) => {
        const stamp = stampAltNameTable.filter(
          stamp =>
            stamp.altName === altName &&
            !this.$store.state.stampNameMap[altName]
        )[0]
        if (!stamp) return match
        return `:${stamp.name}:`
      })
    },
    beforeinput(event) {
      if (isSendKeyInput(event, this.messageSendKey)) {
        event.preventDefault()
        this.submit()
      }
    },
    input(event) {
      if (this.postStatus === 'processing') {
        return
      }
      this.postStatus = 'default'
    },
    keydown(event) {
      if (this.postStatus === 'processing') {
        event.preventDefault()
        return
      }
      if (event.key === 'Tab') {
        event.preventDefault()
        this.replaceSuggest()
        autosize.update(this.messageInput)
        return
      }
      this.postStatus = 'default'
      if (withModifierKey(event)) {
        this.isPushedModifierKey = true
      }
      // #945
      if (event.key === 'Enter' && !event.isComposing) {
        if (this.messageSendKey === 'modifier' && withModifierKey(event)) {
          event.preventDefault()
          this.submit()
          return
        }
        if (
          this.messageSendKey === 'none' &&
          !withModifierKey(event) &&
          !isLevel2InputEventsSupported
        ) {
          event.preventDefault()
          this.submit()
          return
        }
      }
      if (isBRKey(event, this.messageSendKey) && !event.isComposing) {
        event.preventDefault()
        const pre = this.inputText.substring(
          0,
          this.messageInput.selectionStart
        )
        const suf = this.inputText.substring(this.messageInput.selectionEnd)
        this.inputText = `${pre}\n${suf}`
        this.$nextTick(() => {
          this.messageInput.selectionStart = this.messageInput.selectionEnd =
            pre.length + 1
        })
      }
    },
    keyup(event) {
      if (isModifierKey(event)) {
        this.isPushedModifierKey = false
      }
    },
    addFiles(event) {
      for (let i = 0; i < event.target.files.length; i++) {
        this.addFile(event.target.files[i])
      }
    },
    dropFile(files) {
      for (let i = 0; i < files.length; i++) {
        this.addFile(files[i])
      }
    },
    addFile(file) {
      if (file.size > 30 * 1000 * 1000) {
        window.alert('ファイルサイズが大きすぎます')
        return
      }
      const files = this.files
      files.push({
        file: file
      })
      let index = files.length - 1
      if (isImage(file.type)) {
        let reader = new FileReader()
        reader.onload = e => {
          this.$set(files[index], 'thumbnail', e.target.result)
        }
        reader.readAsDataURL(file)
      }
      this.files = files
    },
    removeFile(id) {
      this.files.splice(id, 1)
    },
    clickUploadButton() {
      this.uploadElem.click()
    },
    uploadFiles() {
      this.postStatus = 'processing'
      this.uploadedIds = new Array(this.files.length)
      this.uploadProgressSum = 0
      return Promise.all(
        this.files.map(async (file, index) => {
          try {
            let progress = 0
            const res = await client.uploadFile(
              file.file,
              this.$store.state.currentChannel.member || [],
              event => {
                if (event.lengthComputable) {
                  this.uploadProgressSum -= progress
                  progress = event.loaded / event.total
                  this.uploadProgressSum += progress
                }
              }
            )
            this.uploadProgressSum -= progress
            this.uploadProgressSum += 1.0
            this.uploadedIds[index] = res.data.fileId
          } catch (e) {
            console.log(e)
          }
        })
      )
    },
    showStampPicker() {
      this.$store.commit('setStampPickerModeAsInput')
      this.$store.commit('setStampPickerActive', !this.stampPickerActive)
    },
    pasteImage(event) {
      const items = event.clipboardData.items
      for (let i = 0; i < items.length; i++) {
        if (items[i].kind === 'string') {
          continue
        }
        const item = items[i]
        const file = item.getAsFile()
        this.addFile(file)
      }
    },
    replaceSuggest() {
      const endIndex = this.messageInput.selectionEnd - 1
      for (let i = endIndex; i >= 0; i--) {
        if (/[a-z0-9_/-]/i.test(this.inputText[i])) {
          continue
        } else if (/#|＃/.test(this.inputText[i])) {
          const prefix = this.$store.getters.getChannelPrefix(
            this.inputText.substring(i + 1, endIndex + 1)
          )
          this.inputText =
            this.inputText.substring(0, i) +
            '#' +
            prefix +
            this.inputText.substring(endIndex + 1)
          return
        } else if (/@|＠/.test(this.inputText[i])) {
          const prefix = this.$store.getters.getMemberPrefix(
            this.inputText.substring(i + 1, endIndex + 1)
          )
          this.inputText =
            this.inputText.substring(0, i) +
            '@' +
            prefix +
            this.inputText.substring(endIndex + 1)
          return
        } else {
          return
        }
      }
    }
  },
  computed: {
    ...mapGetters(['stampPickerActive']),
    ...mapState(['messageSendKey']),
    showKeyGuide() {
      return (
        this.isPushedModifierKey &&
        !(this.messageSendKey === 'modifier' && !this.canSubmit)
      )
    },
    currentChannel() {
      return this.$store.state.currentChannel
    },
    inputText: {
      get() {
        return this.$store.getters['messageInput/inputText'](
          this.currentChannel.channelId
        )
      },
      set(inputText) {
        this.$store.commit('messageInput/setInputText', {
          inputText,
          channelId: this.currentChannel.channelId
        })
      }
    },
    files: {
      get() {
        return this.$store.getters['messageInput/inputFiles'](
          this.currentChannel.channelId
        )
      },
      set(files) {
        this.$store.commit('messageInput/setInputFiles', {
          files,
          channelId: this.currentChannel.channelId
        })
      }
    },
    suggests() {
      if (this.key.type === '') {
        return []
      }
      return suggest(this.key, this.limit)
    },
    uploadProgress() {
      if (this.uploadedIds.length === 0) return 0
      return this.uploadProgressSum / this.uploadedIds.length
    },
    channelTitle() {
      if (this.$route.params.user) return `@${this.$route.params.user}`
      if (!this.$route.params.channel) return ''
      let ret = '#'
      this.$route.params.channel
        .split('/')
        .slice(0, -1)
        .forEach(e => {
          ret += e.charAt(0) + '/'
        })
      ret += this.$store.state.currentChannel.name
      return ret
    },
    placeholder() {
      return `Message ${this.channelTitle}`
    },
    hasFile() {
      return this.files.length > 0
    },
    isEmptyMessage() {
      return this.inputText.length === 0
    },
    canSubmit() {
      return this.hasFile || !this.isEmptyMessage
    },
    sendButtonStyle() {
      return {
        opacity: this.canSubmit ? 1 : 0.4
      }
    },
    me() {
      return this.$store.state.me
    },
    typingUsers() {
      return this.$store.state.heartbeatStatus.userStatuses
        .filter(user => user.userId !== this.me.userId)
        .filter(user => user.status === 'editing')
    },
    isAnyoneTyping() {
      return this.typingUsers.length > 0
    }
  },
  watch: {
    inputText(newText) {
      this.$store.commit('setEditing', this.focused && newText.length > 0)
      this.$nextTick(() => {
        autosize.update(this.messageInput)
      })
    },
    currentChannel() {
      this.$nextTick(() => {
        autosize.update(this.messageInput)
      })
    }
  },
  mounted() {
    autosize(document.getElementById('message-input-text-area'))
    this.messageInput = document.getElementById('message-input-text-area')
    this.uploadElem = document.getElementById('upload')
  }
}
</script>

<style lang="sass">
$message-input-min-height: 50px
$message-input-button-height-sp: 50px - 2px
$message-input-button-height-pc: 40px - 2px

.message-input
  background-color: var(--background-color)
  margin:
    top: auto
  +mq(pc)
    flex-shrink: 0
    min-height: 50px
    position: relative
    width: calc(100vw - #{$sidebar-width})
    padding-bottom: 10px
  +mq(sp)
    position: relative
    width: 100vw
  z-index: $message-input-index

.message-input-body
  display: flex
  flex-flow: column
  background: var(--background-color)
  position: relative  // for progres bar
  +mq(sp)
    border:
      top:
        style: solid
        color: var(--tertiary-color-on-bg)
        width: 1px
        radius: 8px
  +mq(pc)
    border:
      style: solid
      color: var(--tertiary-color-on-bg)
      width: 1px
      radius: 8px
  padding:
    right: 6px
    left: 6px
  width: 100%
  +mq(pc)
    width: calc(100% - 20px)
    margin: 0 auto 0

.message-input-progress-bar
  position: absolute
  height: 5px
  top: 0
  left: 0
  background-color: var(--primary-color-transparent)

.message-input-buttons-wrapper
  +mq(pc)
    display: none
  display: flex
  flex-flow: row
  margin:
    top: 6px

.message-input-button
  .message-input-text-area-wrapper &
    +mq(sp)
      display: none
  cursor: pointer
  padding:
    left: 6px
    right: 6px
  height: $message-input-button-height-pc

  &:hover
    background: var(--background-hover-color)

.message-input-send-button
  cursor: pointer
  padding:
    left: 6px
    right: 6px
  height: $message-input-button-height-pc

  &:hover
    background: var(--background-hover-color)

.message-input-files-wrapper
  display: flex
  flex:
    flow: row
    wrap: nowrap
  overflow:
    x: scroll
  margin:
    top: 6px

.message-input-file
  position: relative
  display: flex
  flex-shrink: 0
  align-items: center
  width: 150px
  margin:
    right: 6px
  padding: 4px
  border-radius: 3px

  &:hover
    background: var(--background-hover-color)

.message-input-file-thumbnail
  width: 50px
  height: 50px
  background:
    size: cover
  flex-shrink: 0

.message-input-file-icon
  width: 50px
  height: 50px
  flex-shrink: 0

.message-input-file-name
  margin-left: 4px
  font-size: 12px
  color: var(--tertiary-color-on-bg)
  height: 50px
  line-height: 50px

.message-input-file-close-button
  position: absolute
  top: 0
  right: 0
  cursor: pointer

.message-input-text-area-wrapper
  position: relative
  display: flex
  flex-flow: row
  align-items: flex-end
  width: 100%
  height: 100%

#message-input-text-area
  font-family: 'メイリオ', Meiryo,'Hiragino Kaku Gothic ProN','ヒラギノ角ゴ ProN W3','ＭＳ Ｐゴシック','MS PGothic','MS UI Gothic','Helvetica','Arial',sans-serif
  display: block
  background: none
  color: var(--text-color)
  resize: none
  width: 100%
  height: $message-input-button-height-pc
  max-height: 240px
  padding:
    top: 9px
    left: 6px
    right: 6px
    bottom: 9px

  &::placeholder
    transform: translateX(2px)
    color: var(--tertiary-color-on-bg)
    opacity: 0.6
    text-overflow: ellipsis
    user-select: none

.typing-slide-in
  &-enter-active
    transition: all .3s ease

  &-leave-active
    transition: all .3s ease

  &-enter
    transform: translateY(0)
    opacity: 0

  &-leave-to
    transform: translateY(0)
    opacity: 0

.message-input-key-guide
  position: absolute
  opacity: 0.6
  right: 10px
  top: -5px
  transform: translateY(-100%)
  font:
    size: 0.8em
</style>
