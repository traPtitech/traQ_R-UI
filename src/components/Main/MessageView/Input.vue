<template lang="pug">
div.input-ui(:class="{'input-focused':focused}")
  input.upload-button(id="upload" style="display:none" type="file" @change="addFiles")
  div.upload-button.flex-center(@click="clickUploadButton")
    icon(name="file")
  div.submit-button.flex-center(@click="submit")
    icon(name="angle-right")
  div.input-area-wrapper(@drom="dropFile")
    p.suggest-element(v-for="(suggest, id) in suggests" @click="replaceSuggest(id)" @mouseover="onmouseover(id)" :style="(suggestMode && suggestIndex === id) ? 'background-color: rgb(255, 255, 0);' : ''" v-html="suggest.html")
    textarea.input-area(id="messageInput" @focus="inputFocus()" @blur="inputBlur()" v-model="inputText" @keydown="keydown" @click="clearKey" ref="inputArea" placeholder="進捗どうですか")
    div(v-for="(file, index) in files" @click="removeFile(index)")
      | {{ file.name }}
</template>

<script>
import autosize from 'autosize'
import client from '@/bin/client'
import suggest from '@/bin/suggest'

export default {
  name: 'Input',
  data () {
    return {
      focused: false,
      inputText: '',
      // postStatus: {'default', 'processing', 'succeeded', 'failed'}
      postStatus: 'default',
      files: [],
      uploadedIds: [],
      messageInput: null,
      key: {
        keyword: '',
        type: ''
      },
      limit: 5,
      suggestMode: false,
      suggestIndex: 0,
      uploadProgressSum: 0
    }
  },
  created () {
    this.$store.subscribe((mutation, state) => {
      if (mutation.type === 'setFiles') {
        console.log(state.files)
        this.dropFile(state.files)
        this.$store.commit('clearFiles')
      }
    })
  },
  methods: {
    inputFocus () {
      this.focused = true
      this.$store.commit('setEditing', true)
    },
    inputBlur () {
      this.focused = false
      this.$store.commit('setEditing', false)
    },
    submit () {
      if (this.inputText === '' && this.files.length === 0) {
        return
      }
      if (this.files.length > 0) {
        this.uploadFiles()
        .then(() => {
          this.files = []
          this.postMessage()
        })
        .catch(err => {
          console.log(err)
          this.postStatus = 'failed'
        })
      } else {
        this.postMessage()
      }
    },
    postMessage () {
      this.postStatus = 'processing'
      let nowChannel = this.$store.state.currentChannel
      let message = this.inputText
      // temporary format
      this.uploadedIds.forEach(id => {
        message += `!{"type": "file", "raw": "", "id": "${id}"}`
      })
      this.uploadedIds = []
      let inCodeBlock = false
      message = message.split('\n').map(line => {
        if (/^```/.test(line)) {
          inCodeBlock = !inCodeBlock
        }
        if (!inCodeBlock) {
          let inQuote = false
          return line.split('`').map(s => {
            if (inQuote) {
              inQuote = false
              return s
            } else {
              inQuote = true
              return this.replaceGroup(this.replaceChannel(this.replaceUser(s)))
            }
          }).join('`')
        } else {
          return line
        }
      }).join('\n')
      const postedMessage = (!nowChannel.dm)
        ? client.postMessage(nowChannel.channelId, message)
        : client.postDirectMessage(this.$store.getters.getUserIdByDirectMessageChannel(nowChannel), message)
      postedMessage
      .then(() => {
        this.inputText = ''
        this.postStatus = 'succeeded'
      })
      .catch(() => {
        this.postStatus = 'failed'
      })
    },
    replaceUser (message) {
      return message.replace(/@([a-zA-Z0-9+_-]{1,32})/g, (match, name) => {
        const user = this.$store.getters.getUserByName(name)
        if (user) {
          return `!{"type": "user", "raw": "${match}", "id": "${user.userId}"}`
        } else {
          return match
        }
      })
    },
    replaceChannel (message) {
      return message.replace(/#([a-zA-Z0-9_/-]+)/g, (match, name) => {
        const channel = this.$store.getters.getChannelByName(name)
        if (channel) {
          return `!{"type": "channel", "raw": "${match.replace(/_/g, '\\_')}", "id": "${channel.channelId}"}`
        } else {
          return match
        }
      })
    },
    replaceGroup (message) {
      return message.replace(/^"@([\S]+)|(?:@([\S]+))/g, (match, userId, content) => {
        if (userId) return match
        const group = this.$store.getters.getGroupByContent(content)
        if (group) {
          return `!{"type": "group", "raw": "${match}", "id": "${group.groupId}"}`
        } else {
          return match
        }
      })
    },
    clearKey () {
      this.key = {
        type: '',
        keyword: ''
      }
    },
    keydown (event) {
      if (this.postStatus === 'processing') {
        event.returnValue = false
        return
      }
      this.postStatus = 'default'
      if (this.suggests.length === 0) {
        this.suggestMode = false
        this.suggestIndex = 0
      } else {
        if (!this.suggestMode) {
          if (event.keyCode === 40 || event.keyCode === 38) {
            this.suggestMode = true
            this.suggestIndex = 0
            event.returnValue = false
            return
          }
        } else {
          if (event.keyCode === 40 || event.keyCode === 38) {
            if (event.keyCode === 40) {
              this.suggestIndex++
            } else {
              this.suggestIndex--
            }
            if (this.suggestIndex < 0) {
              this.suggestIndex = 0
            }
            if (this.suggestIndex >= this.suggests.length) {
              this.suggestIndex = this.suggests.length - 1
            }
            event.returnValue = false
            return
          } else if (event.keyCode === 13) {
            this.replaceSuggest(this.suggestIndex)
            event.returnValue = false
            return
          }
        }
      }
      this.key = {
        type: '',
        keyword: ''
      }
      this.suggestMode = false
      if (event.key === 'Enter' && (event.ctrlKey || event.metaKey || event.shiftKey)) {
        this.submit()
        event.returnValue = false
      } else {
        this.$nextTick(() => {
          const selectionStart = this.messageInput.selectionStart
          const selectionEnd = this.messageInput.selectionEnd
          if (!selectionStart || selectionStart !== selectionEnd) {
            return
          }
          const inputSubstr = this.inputText.substr(0, selectionStart)
          inputSubstr.replace(/#([a-zA-Z0-9_/-]*)$/, (match, key) => {
            this.key = {
              keyword: key.toLowerCase(),
              type: '#'
            }
            return match
          })
          inputSubstr.replace(/@([a-zA-Z0-9_-]*)$/, (match, key) => {
            this.key = {
              keyword: key.toLowerCase(),
              type: '@'
            }
            return match
          })
          inputSubstr.replace(/:([a-zA-Z0-9+_-]*)$/, (match, key) => {
            this.key = {
              keyword: key.toLowerCase(),
              type: ':'
            }
            return match
          })
        })
      }
    },
    onmouseover (index) {
      this.suggestMode = true
      this.suggestIndex = index
    },
    replaceSuggest (index) {
      this.suggestMode = false
      this.suggestIndex = 0
      const messageInput = document.getElementById('messageInput')
      const startIndex = messageInput.selectionStart
      const replaceSuffix = this.inputText.substr(startIndex)
      const prefixes = this.inputText.substr(0, startIndex).split(this.key.type)
      const lastSize = prefixes.pop().length + this.key.type.length
      let replacePrefix = prefixes[0]
      for (let i = 1; i < prefixes.length; i++) {
        replacePrefix += this.key.type + prefixes[i]
      }
      const replace = this.suggests[index].start + this.suggests[index].replace + this.suggests[index].suffix
      this.inputText = replacePrefix + replace + replaceSuffix
      this.$nextTick(() => {
        messageInput.selectionStart = messageInput.selectionEnd = startIndex - lastSize + replace.length
      })
      this.key = {
        keyword: '',
        type: ''
      }
    },
    addFiles (event) {
      for (let i = 0; i < event.target.files.length; i++) {
        this.files.push(event.target.files[i])
      }
    },
    dropFile (files) {
      for (let i = 0; i < files.length; i++) {
        this.files.push(files[i])
        this.files.push(files[i])
      }
    },
    removeFile (id) {
      this.files.splice(id, 1)
    },
    clickUploadButton () {
      this.uploadElem.click()
    },
    uploadFiles () {
      this.postStatus = 'processing'
      this.uploadedIds = new Array(this.files.length)
      this.uploadProgressSum = 0
      return Promise.all(this.files.map(async (file, index) => {
        try {
          let progress = 0
          const res = await client.uploadFile(file, this.$store.state.currentChannel.member || [], (event) => {
            if (event.lengthComputable) {
              this.uploadProgressSum -= progress
              progress = event.loaded / event.total
              this.uploadProgressSum += progress
            }
          })
          this.uploadProgressSum -= progress
          this.uploadProgressSum += 1.0
          this.uploadedIds[index] = res.data.fileId
        } catch (e) {
          console.log(e)
        }
      }))
    }
  },
  computed: {
    suggests () {
      if (this.key.type === '') {
        return []
      }
      return suggest(this.key, this.limit)
    },
    uploadProgress () {
      if (this.uploadedIds.length === 0) return 0
      return this.uploadProgressSum / this.uploadedIds.length
    }
  },
  watch: {
    inputAreaHeight () {
      console.log(this.$refs.inputArea.scrollHeight)
      return this.$refs.inputArea.scrollHeight + 'px'
    },
    files (newFiles) {
      this.isOpened = !(newFiles.length === 0 && this.inputText === '')
    }
  },
  mounted () {
    autosize(document.getElementById('messageInput'))
    this.messageInput = document.getElementById('messageInput')
    this.uploadElem = document.getElementById('upload')
  }
}
</script>

<style lang="sass">
.input-ui > *
  pointer-events: auto
.input-ui
  overflow: hidden
  +mq(pc)
    grid-area: input
    position: relative
  +mq(sp)
    position: fixed
  width: 100%
  bottom: 0
  pointer-events: none
.upload-button, .submit-button
  position: absolute
  z-index: 100
  width: 40px
  height: 40px
  bottom: 10px
  font-size: 1.5em
.upload-button
  left: 5px
.submit-button
  right: 5px
.input-area-wrapper
  width: 100%
  min-height: 50px
  max-height: 150px
  overflow-x: hidden
  overflow-y: scroll
  position: relative
  right: 0
  left: 0
  // bottom: 0
  // border-top: solid 1px $border-color
  margin: auto
.input-area
  box-sizing: border-box
  z-index: 100
  width: 100%
  height: $input-height
  margin: 0
  background: none
  resize: none
  -webkit-appearance: none
  padding: 15px 45px
  font-size: 1em
  cursor: text
  border: 0
  line-height: 1em
  animation: openInputArea 1s ease
  background-color: $background-color
  caret-color: $text-color
  /*transition: all .3s ease-in-out*/
  &:focus
    outline: 0
  &::placeholder
  color: rgba(#{$text-color}, 0.5)
    transition: all .3s ease
  &:focus::placeholder
    transform: translateY(-10px)
    opacity: 0

.input-area-opened
@keyframes openInputArea
  0%
    opacity: 0
  100%
    opacity: 1
.input-background
  z-index: 10
  position: absolute
  text-align: center
  box-sizing: border-box
  color: white
  width: 60%
  max-width: 300px
  height: 25px
  bottom: 20px
  right: 0
  left: 0
  margin: auto
  transition: all .2s cubic-bezier(0.645, 0.045, 0.355, 1)
  opacity: 1
  border-radius: 15px
  background-clip: content-box
  cursor: pointer
  &:hover
    box-shadow: 0 0 5px rgba(112, 112, 112, 1)
.input-background-gradation
  background: linear-gradient(95deg,#00E1FF,#e22af9)
.input-background-opened
  width: 100%
  max-width: 100%
  bottom: 0
  height: 60px
  border-width: 0
  border-radius: 0
  opacity: 0
  z-index: -1
.suggest-element
  cursor: pointer

</style>
