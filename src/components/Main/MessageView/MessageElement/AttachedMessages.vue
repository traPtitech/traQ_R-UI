<template lang="pug">
  div.message-attached-messages-wrap
    div.attached-message(
      v-for="(m, index) in messages"
      :key="m.messageId"
      :class="{'attached-message-not-found': !m}")
      template(v-if="m")
        div.attached-message-detail-wrap
          div.attached-message-user-icon(
            :style="userIconBackground(m.userId)"
            @click="openUserModal(m.userId)")
          p.attached-message-user-name(@click="openUserModal(m.userId)")
            | {{userDisplayName(m.userId)}}
        component(:is="renderedBodies[index]" v-bind="$props")
        div.attached-message-from
          | from
          router-link.attached-message-from-link(:to="parentChannel(m.parentChannelId).to")
            | {{parentChannel(m.parentChannelId).name}}
          a.attached-message-modal-link(@click="$store.dispatch('openMessageModal', m)")
            | View Message
      template(v-else)
        p
          | Message Not Found
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { rendererManager } from '@/bin/markdown'

export default {
  name: 'AttachedMessages',
  props: {
    messages: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      renderedBodies: []
    }
  },
  async mounted() {
    this.renderedBodies = await Promise.all(
      this.messages.map(m => this.mark(m.content))
    )
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
    async mark(text) {
      return {
        template: `<div class="message-content markdown-body" v-pre>${await rendererManager.render(
          this.$store.state.currentChannel.channelId,
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

.attached-message-from-link
  margin:
    left: 0.2em

.attached-message-modal-link
  color: $link-color
  margin-left: 8px
  cursor: pointer

.attached-message-not-found
  color: var(--warning-color)
  border-left:
    color: var(--warning-color)
</style>
