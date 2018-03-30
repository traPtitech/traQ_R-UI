<template lang="pug">
div.message
  div.message-user-icon-wrap(v-on:click="openUserModal(model.userId)")
    img.message-user-icon(:src="`${$store.state.baseURL}/api/1.0/users/${model.userId}/icon`")
  div.message-detail-wrap
    div.message-detail-left
      p.message-user-name(v-on:click="openUserModal(model.userId)")
        | {{$store.state.memberMap[model.userId].displayName}}
      p.message-user-id(v-on:click="openUserModal(model.userId)")
        | @{{$store.state.memberMap[model.userId].name}}
    p.message-date
      | {{dateTime(model.datetime)}}
  div.message-content-wrap
    component(v-if="!isEditing" v-bind:is="renderedText" v-bind="$props")
    div(v-if="isEditing")
      textarea(v-model="edited" )
      button(v-on:click="editSubmit" )
        | submit
      button(v-on:click="editCancel" )
        | cancel
  div.message-buttons-wrap
    button(v-if="model.userId === $store.getters.getMyId" v-on:click="editMessage")
      | edit
    button(v-on:click="deleteMessage")
      | delete
    button(v-on:click="unpinMessage" v-if="pinned")
      | unpin
    button(v-on:click="pinMessage" v-else)
      | pin
    button(v-on:click="unclipMessage" v-if="cliped")
      | unclip
    button(v-on:click="clipMessage" v-else)
      | clip
    button(v-on:click="copyMessage")
      | copy
  div.message-stamps-wrap(style="display: table;")
    div(v-for="stamp in stamps" style="display: table-cell;")
      div(v-on:click="toggleStamp(stamp.stampId)" :title="stamp.title")
        i(class="emoji s16" :style="`background-image: url(${$store.state.baseURL}/api/1.0/files/${stamp.fileId});`")
          | {{stamp.name}}
        p
          | {{stamp.sum}}
    StampList(:model="{messageId: model.messageId}")
  div.message-messages-wrap
    div.attached-message(v-for="m in messages")
      img.message-user-icon(:src="`${$store.state.baseURL}/api/1.0/files/${$store.state.memberMap[m.userId].iconFileId}`" v-on:click="openUserModal(m.userId)")
      p.message-user-name(v-on:click="openUserModal(m.userId)")
        | {{$store.state.memberMap[m.userId].displayName}}
      p.message-user-id(v-on:click="openUserModal(m.userId)")
        | @{{$store.state.memberMap[m.userId].name}}
      component(v-bind:is="mark(m.content)" v-bind="$props")
      small
        | referenced from
        router-link(:to="`/channels/${$store.getters.getChannelPathById(m.parentChannelId)}`")
          | {{`#${$store.getters.getChannelPathById(m.parentChannelId)}`}}
  div.message-files-wrap
    div(v-for="file in files")
      img.attached-image(v-if="file.mime.split('/')[0] === 'image' && file.mime.split('/')[1] === 'gif'" :src="`${$store.state.baseURL}/api/1.0/files/${file.fileId}/thumbnail`" :onclick="`this.src='${$store.state.baseURL}/api/1.0/files/${file.fileId}'`" :alt="file.name")
      a(:href="`${$store.state.baseURL}/api/1.0/files/${file.fileId}`" target="_blank" rel="nofollow noopener noreferrer")
        video.attached-video(v-if="file.mime.split('/')[0] === 'video'" :src="`${$store.state.baseURL}/api/1.0/files/${file.fileId}`" :alt="file.name" preload="none" controls)
        audio.attached-audio(v-if="file.mime.split('/')[0] === 'audio'" :src="`${$store.state.baseURL}/api/1.0/files/${file.fileId}`" :alt="file.name" preload="none" controls)
        img.attached-image(v-if="file.mime.split('/')[0] === 'image' && file.mime.split('/')[1] !== 'gif'" :src="`${$store.state.baseURL}/api/1.0/files/${file.fileId}/thumbnail`" :alt="file.name")
      a.attached-file(:href="`${$store.state.baseURL}/api/1.0/files/${file.fileId}?dl=1`" :download="file.name")
        p
          | {{file.name}}
        br
        small
          | {{encodeByte(file.size)}}
</template>

<script>
import md from '@/bin/markdown-it'
import client from '@/bin/client'
function isFile (text) {
  try {
    const data = JSON.parse(text)
    if (data['type'] === 'file' && typeof data['id'] === 'string' && typeof data['raw'] === 'string') {
      return true
    } else {
      return false
    }
  } catch (e) {
    return false
  }
}
function isMessage (text) {
  try {
    const data = JSON.parse(text)
    if (data['type'] === 'message' && typeof data['id'] === 'string' && typeof data['raw'] === 'string') {
      return true
    } else {
      return false
    }
  } catch (e) {
    return false
  }
}
function detectFiles (text) {
  let isInside = false
  let startIndex = -1
  let isString = false
  const ret = []
  for (let i = 0; i < text.length; i++) {
    if (isInside) {
      if (text[i] === '"') {
        isString ^= true
      } else if (!isString && text[i] === '}') {
        isInside = false
        if (isFile(text.substr(startIndex + 1, i - startIndex)) || isMessage(text.substr(startIndex + 1, i - startIndex))) {
          ret.push(JSON.parse(text.substr(startIndex + 1, i - startIndex)))
        } else {
          i = startIndex + 1
        }
      }
    } else {
      if (i < text.length - 1 && text[i] === '!' && text[i + 1] === '{') {
        startIndex = i
        i++
        isInside = true
        isString = false
      }
    }
  }
  return ret
}
export default {
  name: 'MessageElement',
  props: {
    model: Object
  },
  data () {
    return {
      isEditing: false,
      edited: '',
      pin: null,
      files: [],
      messages: []
    }
  },
  methods: {
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
      await client.pinMessage(this.$store.state.currentChannel.channelId, this.model.messageId)
      this.$store.dispatch('getCurrentChannelPinnedMessages', this.$store.state.currentChannel.channelId)
    },
    async unpinMessage () {
      await client.unpinMessage(this.pin.pinId)
      this.$store.dispatch('getCurrentChannelPinnedMessages', this.$store.state.currentChannel.channelId)
    },
    clipMessage () {
      client.clipMessage(this.model.messageId)
      .then(res => {
        this.$store.commit('setClipedMessages', res.data)
      })
    },
    unclipMessage () {
      client.unclipMessage(this.model.messageId)
      .then(res => {
        this.$store.commit('setClipedMessages', res.data)
      })
    },
    dateTime: function (datetime) {
      const d = new Date(datetime)
      return d.getHours().toString().padStart(2, '0') + ':' + d.getMinutes().toString().padStart(2, '0') + ':' + d.getSeconds().toString().padStart(2, '0')
    },
    async getAttachments () {
      const data = detectFiles(this.model.content)
      this.files = (await Promise.all(data.filter(e => e.type === 'file').map(async e => {
        return this.$store.getters.getFileDataById(e.id)
        .then(res => res.data)
        .catch(e => null)
      }))).filter(e => e)
      this.messages = (await Promise.all(data.filter(e => e.type === 'message').map(async e => {
        return client.getMessage(e.id)
          .then(res => res.data)
          .catch(e => null)
      }))).filter(e => e)
    },
    toggleStamp (stampId) {
      if (this.stamps.find(e => e.stampId === stampId).user.find(e => e.userId === this.$store.state.me.userId)) {
        client.unstampMessage(this.model.messageId, stampId)
      } else {
        client.stampMessage(this.model.messageId, stampId)
      }
    },
    encodeByte (byte) {
      const suffixes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB']
      let rank = 0
      while (byte >= 1000) {
        byte /= 1000
        rank++
      }
      const nums = byte.toPrecision(4).split('.')
      if (nums.length > 1) {
        return nums[0] + '.' + nums[1][0] + suffixes[rank]
      } else {
        return nums[0] + suffixes[rank]
      }
    },
    mark (text) {
      return {
        template: `<div class="message-content">${md.render(text)}</div>`,
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
    openUserModal (userId) {
      this.$store.dispatch('openUserModal', userId)
    }
  },
  computed: {
    renderedText () {
      return {
        template: `<div class="message-content">${md.render(this.model.content)}</div>`,
        props: this.$options.props
      }
    },
    cliped () {
      return this.$store.state.clipedMessages[this.model.messageId]
    },
    pinned () {
      this.pin = this.$store.getters.isPinned(this.model.messageId)
      return this.pin
    },
    stamps () {
      const map = {}
      if (!this.model.stampList) {
        return []
      }
      this.model.stampList.forEach(stamp => {
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
        if (lhs.createdAt < rhs.createdAt) {
          return -1
        } else if (lhs.createdAt > rhs.createdAt) {
          return 1
        } else {
          return 0
        }
      })
      return stamps
    }
  },
  mounted () {
    this.getAttachments()
  },
  components: {
    'StampList': window.asyncLoadComponents(import('@/components/Main/MessageView/StampList'))
  }
}
</script>

<style lang="sass">
.message
  display: grid
  grid-template-areas: "user-icon detail""user-icon content""... buttons"
  grid-template-rows: 20px 1fr 20px
  grid-template-columns: 40px 1fr
  border-top: solid 1px rgba(0, 0, 0, 0.1)
  padding: 10px 10px
.message-user-icon-wrap
  grid-area: user-icon
.message-user-icon
  width: 40px
  height: 40px
  background-color: white
  border-radius: 100%
.message-detail-wrap
  grid-area: detail
  display: flex
  justify-content: space-between
  align-items: center
.message-detail-left
  display: flex
  align-items: center
.message-user-name
  margin: 0 0 0 10px
  font-weight: bold
.message-user-id
  margin-left: 5px
  font-size: 0.8em
.message-date
  font-size: 0.7em
.message-content-wrap
  grid-area: content
  margin: 0 0 0 10px
  padding: 10px 0
  text-align: left
  font-size: 0.9em
  word-break: break-all
  & pre
    white-space: pre-wrap
.message-buttons-wrap
  grid-area: buttons
.emoji.s16
  width: 16px
  height: 16px
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
.attached-image
  max-width: 360px
  max-height: 480px
.attached-video
  max-width: 360px
  max-height: 480px
  background-color: #000000
.attached-message
  padding: 5px 10px
  border-left: 5px solid
</style>
