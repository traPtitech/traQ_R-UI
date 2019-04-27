<template lang="pug">
  div.member-group-container(:class="memberGroupClass")
    div.member-group-name-container(@click="toggle")
      p
        | {{groupName}}
        span.member-count(v-if="filterUnread") {{ filteredUnreadMembers.length }}
        span.member-count(v-else) {{ filteredMembers.length }}
    div.member-group-list(ref="list")
      transition(name="simple" @after-enter="removeHeight" @after-leave="zeroHeight")
        div(ref="listWrap" v-show="isOpen")
          template(v-if="filterUnread")
            member-element(v-for="member in filteredUnreadMembers" :model="member" :key="member.userId")
          template(v-else)
            member-element(v-for="member in filteredMembers" :model="member" :key="member.userId")
</template>

<script>
import MemberElement from '@/components/Main/Sidebar/Content/MemberElement'
export default {
  name: 'MemberGroup',
  data() {
    return {
      isOpen: false,
      height: 0
    }
  },
  props: {
    groupName: String,
    groupId: String,
    members: Array,
    filterText: {
      type: String,
      default: ''
    },
    filterUnread: {
      type: Boolean,
      default: false
    }
  },
  components: {
    MemberElement
  },
  computed: {
    memberGroupClass() {
      return {
        'is-open': this.isOpen
      }
    },
    filteredMembers() {
      return this.$store.getters
        .sortByUserId(this.members)
        .map(userId => this.$store.state.memberMap[userId])
        .map(u => {
          return { ...u, unread: this.unreadMessagesNum(u.userId) }
        })
        .filter(m => !m.suspended)
        .filter(
          m =>
            this.caseIgnoreFilterText.test(m.displayName) ||
            this.caseIgnoreFilterText.test(m.name)
        )
    },
    filteredUnreadMembers() {
      return this.filteredMembers.filter(u => u.unread > 0)
    },
    caseIgnoreFilterText() {
      return new RegExp(this.filterText, 'i')
    }
  },
  methods: {
    removeHeight() {
      this.$refs.list.style.height = ''
    },
    zeroHeight() {
      this.$refs.list.style.height = '0'
    },
    toggle() {
      this.isOpen = !this.isOpen
      this.$store.dispatch('updateUserListOpen', {
        groupId: this.groupId,
        isOpen: this.isOpen
      })
    },
    directMessageChannel(userId) {
      if (userId === this.$store.state.me.userId) {
        return this.$store.getters.getDirectMessageChannels.find(
          channel => channel.member && channel.member.length === 1
        )
      } else {
        return this.$store.getters.getDirectMessageChannels.find(
          channel =>
            channel.member &&
            channel.member.some(dmUserId => dmUserId === userId)
        )
      }
    },
    unreadMessagesNum(userId) {
      if (this.directMessageChannel(userId)) {
        return this.$store.getters.getChannelUnreadMessageNum(
          this.directMessageChannel(userId).channelId
        )
      } else {
        return 0
      }
    }
  },
  watch: {
    isOpen: {
      handler() {
        this.$nextTick(() => {
          this.height = this.$refs.listWrap.clientHeight
          this.$refs.list.style.height = this.height + 'px'
        })
      }
    }
  },
  mounted() {
    if (this.$store.state.openUserLists.hasOwnProperty(this.groupId)) {
      this.isOpen = this.$store.state.openUserLists[this.groupId]
    } else {
      this.isOpen = true
      this.$store.dispatch('updateUserListOpen', {
        groupId: this.groupId,
        isOpen: true
      })
    }
  }
}
</script>

<style lang="sass">
.member-group-container
  & > p
    padding: 5px 10px
.member-group-list
  transition: height .3s ease
  overflow: hidden
  .member-element:first-child
    margin-top: 10px
.member-group-name-container
  position: relative
  user-select: none
  width: 100%
  margin:
    top: 20px
  padding: 3px 0
  cursor: pointer
  font:
    weight: bold
  &:hover
    background: rgba(0,0,0,0.1)
  &::after
    position: absolute
    right: 20px
    top: 50%
    transform: translateY(-50%)
    .is-open &
      transform: translateY(-50%) rotate(0.5turn)
    transition: transform .1s cubic-bezier(1, 0, 0, 1)
    display: block
    content: ''
    width: 0
    height: 0
    border:
      style: solid
      color: white
      top:
        width: 8px
      left:
        width: 6px
        color: transparent
      right:
        width: 6px
        color: transparent
      bottom:
        width: 0
  p
    color: $text-light-color
    padding:
      left: 10px
  .member-count
    padding: 0 0.5rem
    &::after
      content: ")"
    &::before
      content: "("
.simple-enter-active
  transition: all .1s
  opacity: 1
.simple-enter
  opacity: 0
</style>
