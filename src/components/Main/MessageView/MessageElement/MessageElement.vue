<template lang="pug">
div.message(ontouchstart="" :class="{'message-pinned':pinned}" @click="$emit('close')" v-if="!model.reported")
  div.message-user-icon-wrap
    img.message-user-icon(:src="`${$store.state.baseURL}/api/1.0/files/${$store.state.memberMap[model.userId].iconFileId}`" @click="openUserModal(model.userId)")
  div.message-detail-wrap
    div.message-user-info-wrap
      div.text-ellipsis.message-user-name(@click="openUserModal(model.userId)")
        | {{getUserName(model.userId)}}
      div.text-ellipsis.message-user-id(@click="openUserModal(model.userId)")
        | @{{$store.state.memberMap[model.userId].name}}
    time.message-date
      | {{displayDateTime}}
    ul.message-buttons-wrap
      li(v-if="model.userId === $store.getters.getMyId" @click="editMessage")
        icon(name="edit")
      li(v-if="model.userId === $store.getters.getMyId" @click="deleteMessage")
        icon(name="trash-alt")
      li.button-pushed(@click="unpinMessage" v-if="pinned")
        icon(name="thumbtack")
      li(@click="pinMessage" v-else)
        icon(name="thumbtack")
      li(@click="clipMessage")
        icon(name="paperclip")
      li(@click="copyMessage" v-if="!isDirectMessage")
        icon(name="copy")
      li(@click="reportMessage")
        icon(name="ban")
  div.message-contents-wrap
    div.message-text-wrap
      component(v-if="!isEditing" :is="renderedText" v-bind="$props")
      div(v-if="isEditing")
        textarea.input-reset.edit-area(v-model="edited")
        button.edit-button.edit-cancel(@click.stop="editCancel" )
          | Cancel
        button.edit-button.edit-submit(@click.stop="editSubmit" )
          | Edit
    div.message-messages-wrap
      div.attached-message(v-for="m in messages")
        img.message-user-icon(:src="`${$store.state.baseURL}/api/1.0/files/${$store.state.memberMap[m.userId].iconFileId}`" @click="openUserModal(m.userId)")
        p.message-user-name(@click="openUserModal(m.userId)")
          | {{getUserName(m.userId)}}
        component(:is="mark(m.content)" v-bind="$props")
        small
          | from
          router-link(:to="parentChannel(m.parentChannelId).to")
            | {{parentChannel(m.parentChannelId).name}}
    div.message-files-wrap
      div(v-for="file in files")
        div(v-if="file.fileId !== ''")
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
        div(v-else)
          a
            p
              | Not Found
            br
            small
              | {{encodeByte(0)}}
    div.message-actions-wrap
      transition-group.message-stamps-wrap(name="slide-in" :class="{'has-stamps':stamps.length>0}")
        div.stamp-container(:key="stamp.stampId" v-for="stamp in stamps" @click="toggleStamp(stamp.stampId)" :title="stamp.title" :class="{'stamp-pressed':isContainSelfStamp(stamp.stampId)}")
          div.emoji(:style="`background-image: url(${$store.state.baseURL}/api/1.0/files/${stamp.fileId});`")
          p.stamp-number
            | {{stamp.sum}}
        StampButton.message-stamp-button(key="stampbutton" :model="{messageId: model.messageId}")
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
      await client.pinMessage(this.model.messageId)
      this.$store.dispatch('getCurrentChannelPinnedMessages', this.$store.state.currentChannel.channelId)
    },
    async unpinMessage () {
      await client.unpinMessage(this.pin.pinId)
      this.$store.dispatch('getCurrentChannelPinnedMessages', this.$store.state.currentChannel.channelId)
    },
    clipMessage () {
      client.clipMessage('', this.model.messageId)
    },
    dateTime: function (datetime) {
      const d = new Date(datetime)
      return d.getHours().toString().padStart(2, '0') + ':' + d.getMinutes().toString().padStart(2, '0') + ':' + d.getSeconds().toString().padStart(2, '0')
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
    },
    toggleStamp (stampId) {
      if (this.isContainSelfStamp(stampId)) {
        client.unstampMessage(this.model.messageId, stampId)
      } else {
        client.stampMessage(this.model.messageId, stampId)
      }
    },
    isContainSelfStamp (stampId) {
      return this.stamps.find(e => e.stampId === stampId).user.find(e => e.userId === this.$store.state.me.userId)
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
    openUserModal (userId) {
      this.$store.dispatch('openUserModal', userId)
    },
    parentChannel (parentChannelId) {
      const channel = this.$store.state.channelMap[parentChannelId]
      if (!channel) {
        return {
          to: '#',
          name: '???'
        }
      }
      if (channel.parent === this.$store.state.directMessageId) {
        let userName = this.$store.state.me.name
        channel.member.forEach(userId => {
          if (userId !== this.$store.state.me.userId) {
            userName = this.$store.state.memberMap[userId].name
          }
        })
        return {
          to: `/users/${userName}`,
          name: `@${userName}`
        }
      } else {
        return {
          to: `/channels/${this.$store.getters.getChannelPathById(parentChannelId)}`,
          name: `#${this.$store.getters.getChannelPathById(parentChannelId)}`
        }
      }
    },
    getUserName (userId) {
      const user = this.$store.state.memberMap[userId]
      if (user.bot) return user.displayName + '#bot'
      else return user.displayName
    },
    reportMessage () {
      const reason = window.prompt('このメッセージを不適切なメッセージとして通報しますか？\n通報理由を入力してください')
      if (reason) {
        client.reportMessage(this.model.messageId, reason)
        .then(() => {
          this.$store.commit('removeMessage', this.model.messageId)
        })
      }
    }
  },
  computed: {
    renderedText () {
      return this.mark(this.model.content)
    },
    pinned () {
      this.pin = this.$store.getters.isPinned(this.model.messageId)
      return this.pin
    },
    displayDateTime () {
      const d = new Date(this.model.createdAt)
      if (this.model.createdAt === this.model.updatedAt) {
        return d.getHours().toString().padStart(2, '0') + ':' + d.getMinutes().toString().padStart(2, '0') + ':' + d.getSeconds().toString().padStart(2, '0')
      } else {
        const u = new Date(this.model.updatedAt)
        let result = u.getHours().toString().padStart(2, '0') + ':' + u.getMinutes().toString().padStart(2, '0') + ':' + u.getSeconds().toString().padStart(2, '0') + ' 編集済み'
        if (d.getDate() !== u.getDate() || d.getMonth() !== u.getMonth()) {
          result = (u.getMonth() + 1).toString().padStart(2, '0') + '/' + u.getDate().toString().padStart(2, '0') + ' ' + result
        }
        if (d.getFullYear() !== u.getFullYear()) {
          result = u.getFullYear().toString() + '/' + result
        }
        return result
      }
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
        return new Date(lhs.createdAt).getTime() - new Date(rhs.createdAt).getTime()
      })
      return stamps
    },
    isDirectMessage () {
      if (this.$store.state.currentChannel.channelId === this.$store.state.directMessageId) return true
      if (this.$store.state.currentChannel.member) return true
      return false
    }
  },
  mounted () {
    this.getAttachments()
  },
  components: {
    'StampButton': window.asyncLoadComponents(import('@/components/Main/MessageView/StampButton'))
  }
}
</script>

<style lang="sass">
.message
  display: grid
  grid-template-areas: "user-icon detail""user-icon contents""... contents"
  grid-template-rows: 20px 1fr
  grid-template-columns: 40px 1fr
  position: relative
  // border-top: solid 1px rgba(0, 0, 0, 0.1)
  padding: 10px 10px
  width: 100%
  box-sizing: border-box
  transition: background-color .2s ease
  overflow: hidden
  &:hover
    background-color: $background-hover-color
  &.message-pinned
    background-color: #dce3ff
  &.message-pinned:hover
    background-color: #cadaff
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
  height: 100%
  overflow: hidden
  cursor: pointer
.message-user-id
  margin-left: 5px
  font-size: 0.8em
  max-width: 40%
  overflow: hidden
.message-date
  // flex: 1
  display: block
  font-size: 0.7em
  margin-left: 5px
  .message-item:hover &
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
  & pre
    white-space: pre-wrap
.message-messages-wrap
  margin-left: 10px
.message-files-wrap
.message-actions-wrap
  display: flex
  justify-content: space-between
  margin: 10px 0 5px
.message-buttons-wrap
  transition: all .2s ease
  display: none
  justify-content: flex-end
  .message-item:hover &
    display: flex
  & li
    margin: 0 5px
    cursor: pointer
    color: #797979
  & li.button-pushed
    color: #4263da
.message-stamps-wrap
  display: inline-block
  // flex-wrap: wrap
  // align-items: center
.message-user-link
  cursor: pointer
  color: #005BAC
  font-weight: bold
.message-user-link-highlight
  background-color: #FAFFAD
.message-channel-link
.message-tag-link
  cursor: pointer
  color: #005BAC
  font-weight: bold
.message-tag-link-highlight
  background-color: #FAFFAD
.message-stamp-button
  display: inline-block
  margin: 0 5px 0
  color: #797979
  width: 16px
  height: 16px
  opacity: 0
  transition: all .2s ease
  cursor: pointer
  .message-item:hover &
    opacity: 1
.stamp-container
  display: inline-flex
  align-items: center
  background: rgba(97, 97, 97, 0.1)
  color: rgba(#{$text-color}, 0.77)
  padding: 2px 5px
  border-radius: 3px
  margin: 2px
  user-select: none
  transition: all .2s ease
  cursor: pointer
  &.stamp-pressed
    background: rgb(202, 206, 228)
    color: #2f2f2f
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
  font-size: 13px
  margin: 0 3px
.emoji
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
.message-emoji
  user-select: text
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
</style>
