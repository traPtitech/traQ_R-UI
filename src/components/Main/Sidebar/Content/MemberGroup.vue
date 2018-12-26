<template lang="pug">
  div.member-group-container(:class="memberGroupClass")
    div.member-group-name-container(@click="isOpen=!isOpen")
      p
        | {{groupName}}
    div.member-group-list(ref="list")
      transition(name="simple" @after-enter="removeHeight" @after-leave="zeroHeight")
        div(ref="listWrap" v-show="isOpen")
          MemberElement(v-for="member in members" :model="member" :key="member.userId")
</template>

<script>
import MemberElement from '@/components/Main/Sidebar/Content/MemberElement'
export default {
  name: 'MemberGroup',
  data () {
    return {
      isOpen: true,
      height: 0
    }
  },
  props: {
    groupName: String,
    members: Array
  },
  components: {
    MemberElement
  },
  computed: {
    memberGroupClass () {
      return {
        'is-open': this.isOpen
      }
    }
  },
  methods: {
    removeHeight () {
      this.$refs.list.style.height = ''
    },
    zeroHeight () {
      this.$refs.list.style.height = '0'
    }
  },
  watch: {
    isOpen: {
      handler () {
        this.$nextTick(() => {
          this.height = this.$refs.listWrap.clientHeight
          this.$refs.list.style.height = this.height + 'px'
        })
      }
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
.simple-enter-active
  transition: all .1s
  opacity: 1
.simple-enter
  opacity: 0
</style>
