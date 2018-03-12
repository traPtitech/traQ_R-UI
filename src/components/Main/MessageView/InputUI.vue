<template lang="pug">
div.input-ui
  input.upload-button(id="upload" style="display:none" type="file" v-on:change="addFiles")
  div.upload-button(v-if="isOpened" v-on:click="clickUploadButton")
  div.submit-button(v-show="isOpened" v-on:click="submit")
  div.input-area-wrapper(v-on:drom="dropFile" v-show="isOpened")
    textarea.input-area(id="messageInput" v-on:blur="inputBlur()" v-model="inputText" v-on:keydown="keydown" v-bind:class="{'input-area-opened': isOpened}" ref="inputArea" placeholder="進捗どうですか")
    div(v-for="(file, index) in files" v-on:click="removeFile(index)")
      | {{ file.name }}
  div.input-background.input-appeared.input-background-gradation(v-on:click="isOpened = !isOpened;focus()" v-bind:class="{'input-background-opened': isOpened}")
</template>

<script>
import autosize from 'autosize'
import client from '@/bin/client'

export default {
  name: 'InputUI',
  data () {
    return {
      isOpened: false,
      inputText: '',
      // postStatus: {'default', 'processing', 'successed', 'failed'}
      postStatus: 'default',
      files: [],
      uploadedIds: []
    }
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
    inputBlur () {
      setTimeout(_ => {
        if (this.inputText === '' && this.files.length === 0) {
          this.isOpened = false
        }
      }, 200)
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
      client.postMessage(nowChannel.channelId, message)
      .then((res) => {
        this.inputText = ''
        this.postStatus = 'successed'
        if (nowChannel === this.$store.state.currentChannel) {
          this.$store.commit('addMessages', res.data)
        }
      })
      .catch(() => {
        this.postStatus = 'failed'
      })
    },
    replaceUser (message) {
      return message.replace(/@([a-zA-Z0-9+_-]+)/g, (match, name) => {
        const user = this.$store.getters.getUserByName(name)
        if (user) {
          return `!{"type": "user", "raw": "${match.replace(/_/g, '\\_')}", "id": "${user.userId}"}`
        } else {
          return match
        }
      })
    },
    replaceChannel (message) {
      return message.replace(/#([a-zA-Z0-9+_/-]+)/g, (match, name) => {
        const channel = this.$store.getters.getChannelByName(name)
        if (channel) {
          return `!{"type": "channel", "raw": "${match.replace(/_/g, '\\_')}", "id": "${channel.channelId}"}`
        } else {
          return match
        }
      })
    },
    replaceTag (message) {
      return message.replace(/(?:^@|(?:[^"]@))([^\s]+)/g, (match, content) => {
        const tag = this.$store.getters.getTagByContent(content)
        if (tag) {
          return `!{"type": "tag", "raw": "${match}", "id": "${tag.tagId}"}`
        } else {
          return match
        }
      })
    },
    keydown (event) {
      if (this.postStatus === 'processing') {
        event.returnValue = false
        return
      }
      this.postStatus = 'default'
      if (event.key === 'Enter' && (event.ctrlKey || event.metaKey || event.shiftKey)) {
        this.submit()
        event.returnValue = false
      }
    },
    addFiles (event) {
      for (let i = 0; i < event.target.files.length; i++) {
        this.files.push(event.target.files[i])
      }
    },
    dropFile (event) {
      event.preventDefault()
      for (let i = 0; i < event.dataTransfer.files.length; i++) {
        this.files.push(event.dataTransfer.files[i])
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
.upload-button
  position: absolute
  z-index: 200
  width: 40px
  height: 40px
  background-color: rgb(207, 207, 207)
  bottom: 10px
  left: 5px
.submit-button
  position: absolute
  z-index: 200
  width: 40px
  height: 40px
  background-color: rgb(207, 207, 207)
  bottom: 10px
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
  padding: 10px 60px 10px 10px
  font-size: 1.1em
  cursor: text
  border: 0
  line-height: 1
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
  animation: input-background-gradient 20s ease infinite
  background-size: 200% 100%
@keyframes input-background-gradient
  0%
    background-position: 0% 50%
  50%
    background-position: 100% 50%
  100%
    background-position: 0% 50%
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
</style>
