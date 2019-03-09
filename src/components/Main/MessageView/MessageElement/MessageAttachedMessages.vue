<template lang="pug">
  div.message-attached-messages-wrap
    div.attached-message(v-for="m in messages")
      div.attached-message-detail-wrap
        div.attached-message-user-icon(
          :style="userIconBackground(m.userId)" 
          @click="openUserModal(m.userId)")
        p.attached-message-user-name(@click="openUserModal(m.userId)")
          | {{userDisplayName(m.userId)}}
      component(:is="mark(m.content)" v-bind="$props")
      div.attached-message-from
        | from 
        router-link(:to="parentChannel(m.parentChannelId).to")
          | {{parentChannel(m.parentChannelId).name}}
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import md from '@/bin/markdown-it'

export default {
  name: 'MessageAttachedMessages',
  props: {
    messages: {
      type: Array,
      required: true
    }
  },
  computed: {
    ...mapGetters(['userDisplayName', 'fileUrl'])
  },
  methods: {
    ...mapActions(['openUserModal']),
    userIconBackground(userId) {
      return {
        backgroundImage: `url(${this.fileUrl(
          this.userDetail(userId).iconFileId
        )})`
      }
    },
    userDetail(userId) {
      return this.$store.state.memberMap[userId]
    },
    mark(text) {
      return {
        template: `<div class="message-content markdown-body" v-pre>${md.render(
          text
        )}</div>`,
        props: this.$options.props
      }
    },
    parentChannel(parentChannelId) {
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
          to: `/channels/${this.$store.getters.getChannelPathById(
            parentChannelId
          )}`,
          name: `#${this.$store.getters.getChannelPathById(parentChannelId)}`
        }
      }
    }
  }
}
</script>

<style lang="sass">
.message-attached-messages-wrap
  margin:
    top: 10px
    left: 10px

.attached-message
  padding: 5px 10px
  border-left:
    width: 4px
    style: solid

.attached-message-detail-wrap
  display: flex

.attached-message-user-icon
  width: 20px
  height: 20px
  border-radius: 100%
  cursor: pointer
  background:
    size: cover
    position: center center
    repeat: no-repeat

.attached-message-user-name
  font:
    weight: bold
    size: 0.9em
  margin:
    left: 6px
  line-height: 20px

.attached-message-from
  font:
    size: 0.8em
  margin:
    top: 12px
</style>
