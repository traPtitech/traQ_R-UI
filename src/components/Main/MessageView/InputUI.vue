<template lang="pug">
div.input-ui
  input.upload-button(id="upload" style="display:none" type="file" v-on:change="addFiles")
  div.upload-button.flex-center(v-if="isOpened" v-on:click="clickUploadButton")
    icon(name="file")
  div.submit-button.flex-center(v-show="isOpened" v-on:click="submit")
    icon(name="angle-right")
  div.input-area-wrapper(v-on:drom="dropFile" v-show="isOpened")
    p.suggest-element(v-for="(suggest, id) in suggests" v-on:click="replaceSuggest(id)" v-on:mouseover="onmouseover(id)" :style="(suggestMode && suggestIndex === id) ? 'background-color: rgb(255, 255, 0);' : ''" v-html="suggest.html")
    textarea.input-area(id="messageInput" v-on:blur="inputBlur()" v-on:focus="inputFocus()" v-model="inputText" v-on:keydown="keydown" v-on:click="clearKey" v-bind:class="{'input-area-opened': isOpened}" ref="inputArea" placeholder="進捗どうですか")
    div(v-for="(file, index) in files" v-on:click="removeFile(index)")
      | {{ file.name }}
  div.input-background.input-appeared.input-background-gradation(v-on:click="isOpened = !isOpened;focus()" v-bind:class="{'input-background-opened': isOpened}")
</template>

<script>
import autosize from 'autosize'
import client from '@/bin/client'
import suggest from '@/bin/suggest'

export default {
  name: 'InputUI',
  data () {
    return {
      isOpened: false,
      inputText: '',
      // postStatus: {'default', 'processing', 'successed', 'failed'}
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
      suggestIndex: 0
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
    focus () {
      if (!this.isOpened) {
        return
      }
      this.$nextTick(() => {
        this.$refs.inputArea.focus()
      })
    },
    inputFocus () {
      this.$store.commit('setEditing', true)
    },
    inputBlur () {
      setTimeout(_ => {
        if (this.inputText === '' && this.files.length === 0) {
          this.isOpened = false
        }
      }, 200)
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
      message = this.replaceUser(message)
      message = this.replaceChannel(message)
      message = this.replaceTag(message)
      if (nowChannel.channelId !== this.$store.state.directMessageId) {
        client.postMessage(nowChannel.channelId, message)
        .then((res) => {
          this.inputText = ''
          this.postStatus = 'successed'
        })
        .catch(() => {
          this.postStatus = 'failed'
        })
      } else {
        client.makeChannel('private', nowChannel.member, String((new Date()).getTime()), this.$store.state.directMessageId)
        .then(res => {
          client.postMessage(res.data.channelId, message)
          .then(() => {
            this.postStatus = 'successed'
            this.inputText = ''
          })
          this.$store.commit('changeChannel', res.data)
        })
        .catch(() => {
          this.postStatus = 'failed'
        })
      }
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
    replaceTag (message) {
      return message.replace(/^"@([\S]+)|(?:@([\S]+))/g, (match, userId, content) => {
        if (userId) return match
        const tag = this.$store.getters.getTagByContent(content)
        if (tag) {
          return `!{"type": "tag", "raw": "${match}", "id": "${tag.tagId}"}`
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
      return Promise.all(this.files.map(async (file, index) => {
        try {
          const res = await client.uploadFile(file)
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
  position: absolute
  width: 100%
  height: 100%
  bottom: 0
  pointer-events: none
.upload-button, .submit-button
  position: absolute
  z-index: 200
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
  min-height: 60px
  max-height: 150px
  overflow-x: hidden
  overflow-y: scroll
  position: absolute
  right: 0
  left: 0
  bottom: 0
  border-top: solid 1px rgba(0, 0, 0, 0.5)
  background-color: white
.input-area
  box-sizing: border-box
  z-index: 100
  width: 100%
  height: 60px
  margin: 0
  background: white
  resize: none
  -webkit-appearance: none
  padding: 10px 60px 10px
  font-size: 1em
  cursor: text
  border: 0
  line-height: 1em
  animation: openInputArea 1s ease
  /*transition: all .3s ease-in-out*/
.input-area:focus
  outline: 0
.input-area::placeholder
  color: rgba(0, 0, 0, 0.5)
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
.input-appeared
  animation: input-background-appeared 1s ease
.input-background-gradation
  background: linear-gradient(95deg,#00E1FF,#e22af9)
  // animation: input-background-gradient 20s ease infinite
  // background-size: 200% 100%
// @keyframes input-background-gradient
//   0%
//     background-position: 0% 50%
//   50%
//     background-position: 100% 50%
//   100%
//     background-position: 0% 50%
@keyframes input-background-appeared
  0%
    bottom: 10px
  100%
    bottom: 20px
.input-background-opened
  width: 100%
  max-width: 100%
  bottom: 0
  height: 60px
  border-width: 0
  border-radius: 0
  opacity: 0
  z-index: -1
.emoji.s16
  width: 16px
  height: 16px
.emoji
  display: inline-block
  text-indent: 999%
  white-space: nowrap
  overflow: hidden
  color: transparent
  background-size: contain
.suggest-element
  cursor: pointer
</style>
