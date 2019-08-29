<template lang="pug">
  .calling-member-element
    .calling-member-element__icon-container(@click="openUserModal")
      img.calling-member-element__icon(:src="userIconSrc")
    .calling-member-element__volume-adjust(v-if="adjustVolume")
      InputSlider(
        v-model="volume"
        :min="0"
        :max="100"
      )
    .calling-member-element__user(v-else @click="openUserModal")
      span.calling-member-element__username.text-ellipsis
        | {{userName}}
      span.calling-member-element__mic-muted-indicator(v-if='micMuted')
        icon-mic-off(size='16')
</template>

<script>
import { mapGetters } from 'vuex'
import InputSlider from '@/components/Atom/InputSlider'
import IconMicOff from '@/components/Icon/IconMicOff'

export default {
  name: 'CallingMemberElement',
  components: {
    InputSlider,
    IconMicOff
  },
  data() {
    return {
      volume:
        this.$store.state.rtc.userVolumeMap[this.member.userId] * 100 || 100,
      debounceDelay: 100,
      debounceLastTime: 0,
      debounceTimerId: -1
    }
  },
  props: {
    member: {
      type: Object,
      required: true
    },
    adjustVolume: {
      type: Boolean,
      required: true
    },
    talking: {
      type: Boolean,
      default: false
    },
    micMuted: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapGetters(['fileUrl']),
    userId() {
      return this.member.userId
    },
    userIconSrc() {
      return this.fileUrl(this.$store.state.memberMap[this.userId].iconFileId)
    },
    userName() {
      return this.getUserName(this.userId)
    }
  },
  methods: {
    openUserModal() {
      this.$store.dispatch('openUserModal', this.userId)
    },
    getUserName(userId) {
      const user = this.$store.state.memberMap[userId]
      if (user.bot) return user.displayName + '#bot'
      else return user.displayName
    },
    updateVolumeAction() {
      this.$store.commit('rtc/setUserVolume', {
        userId: this.member.userId,
        volume: this.volume / 100
      })
    },
    updateVolume() {
      if (this.debounceTimerId !== -1) {
        clearTimeout(this.debounceTimerId)
      }
      this.debounceTimerId = setTimeout(
        this.updateVolumeAction,
        this.debounceDelay
      )
    }
  },
  watch: {
    volume() {
      this.updateVolume()
    }
  }
}
</script>

<style lang="sass">
.calling-member-element
  display: flex
  align-items: center
  padding:
    top: 2px
    left: 4px
    right: 4px
    bottom: 2px

  &:hover
    background: rgba(0,0,0,0.1)

.calling-member-element__icon
  min-width: 30px
  width: 30px
  height: 30px
  border:
    radius: 100%
  cursor: pointer

.calling-member-element__user
  display: flex
  align-items: center
  justify-content: space-between
  width: 100%

.calling-member-element__username
  margin:
    left: 6px
  line-height: 1.4em
  cursor: pointer

.calling-member-element__mic-muted-indicator
  margin-right: -4px
  opacity: 0.5

.calling-member-element__volume-adjust
  width: 100%
  height: 100%
  margin-left: 6px
</style>
