<template lang="pug">
.user-modal-tags
  .user-modal-tags-container.is-scroll
    .user-modal-tag-element(v-for="(tag, index) in tags" :key="tag.tagId")
      .user-modal-tag-icon
        IconTag(size="16" color="gray")
      .user-modal-tag-body(@click="openTagModal(tag)")
        | {{tag.tag}}
      .user-modal-tag-status-icon
        .user-modal-icon-wrap(@click="lockTag(index)" v-show="hasAuth && !tag.isLocked" role="button")
          IconUnlocked(size="16" color="gray")
        .user-modal-icon-wrap(@click="eraseTag(index)" v-show="!tag.isLocked" role="button")
          IconClose(size="16" color="gray")
        .user-modal-icon-wrap(@click="unlockTag(index)" v-show="hasAuth && tag.isLocked" role="button")
          IconLocked(size="16" color="gray")
        .user-modal-icon-wrap(v-show="!hasAuth && tag.isLocked")
          IconLocked.non-clickable(size="16" color="gray")
  .user-modal-tags-input-container
    .user-modal-tags-icon
      IconTag(size="16" color="gray" :style="detailInputIconStyle")
    input.user-modal-tags-input.input-reset(
      v-model="tagInput"
      @keydown="onInputChange"
      placeholder="タグを追加……"
    )
    .user-modal-tags-icon(@click="addTag" role="button")
      IconPlus(size="16" color="gray" :style="detailInputIconStyle")
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import client from '@/bin/client'
import IconTag from '@/components/Icon/IconTag'
import IconPlus from '@/components/Icon/IconPlus'
import IconClose from '@/components/Icon/IconClose'
import IconLocked from '@/components/Icon/IconLocked'
import IconUnlocked from '@/components/Icon/IconUnlocked'

export default {
  name: 'UserModalTags',
  components: {
    IconTag,
    IconPlus,
    IconClose,
    IconLocked,
    IconUnlocked
  },
  data() {
    return {
      tagInput: ''
    }
  },
  computed: {
    ...mapState('modal', ['data']),
    ...mapGetters('modal', {
      tags: 'currentUserTagsSorted'
    }),
    hasAuth() {
      if (this.data) {
        return this.data.name === this.$store.state.me.name
      }
      return false
    },
    detailInputIconStyle() {
      return {
        color: this.tagInput.length > 0 ? 'gray' : 'lightgray'
      }
    }
  },
  methods: {
    openTagModal(tag) {
      this.$store.dispatch('openTagModal', tag)
    },
    onInputChange(event) {
      if (
        event.key === 'Enter' &&
        (event.ctrlKey || event.metaKey || event.shiftKey)
      ) {
        this.addTag()
        event.preventDefault()
      }
    },
    addTag() {
      if (this.tagInput === '') {
        return
      }
      client.addUserTag(this.data.userId, this.tagInput).then(() => {
        this.tagInput = ''
        this.$store.dispatch('modal/updateCurrentUserTags')
      })
    },
    eraseTag(id) {
      client.deleteUserTag(this.data.userId, this.tags[id].tagId).then(() => {
        this.$store.dispatch('modal/updateCurrentUserTags')
      })
    },
    lockTag(id) {
      client
        .changeLockUserTag(this.data.userId, this.tags[id].tagId, true)
        .then(() => {
          this.$store.dispatch('modal/updateCurrentUserTags')
        })
    },
    unlockTag(id) {
      client
        .changeLockUserTag(this.data.userId, this.tags[id].tagId, false)
        .then(() => {
          this.$store.dispatch('modal/updateCurrentUserTags')
        })
    }
  }
}
</script>

<style lang="sass">
$input-height: 3rem

.user-modal-tags
  display: flex
  flex-direction: column
  width: 100%

.user-modal-tags-container
  min-height: 0
  overflow-y: scroll
  flex: 1

.user-modal-tag-element
  $gap: 1rem
  display: grid
  grid-template-columns: 2rem calc(100% - 6rem - 1rem * 2) 4rem
  grid-gap: $gap
  +mq(pc)
    padding: 0.8rem 2.5rem
  +mq(sp)
    padding: 0.6rem 2rem
  &:first-child
    margin-top: 1rem
  &:last-child
    margin-bottom: 1rem
  &:hover
    background: $background-hover-color

  .user-modal-tag-icon
    display: flex
    align-items: center
    height: 100%

  .user-modal-tag-body
    flex: auto
    word-wrap: break-word
    cursor: pointer

  .user-modal-tag-status-icon
    display: flex
    justify-content: flex-end
    align-items: center

.user-modal-tags-input-container
  height: $input-height
  flex: 0 0 $input-height
  display: flex
  align-items: center
  justify-content: center

  .user-modal-tags-input
    height: 2.2rem
    width: calc(100% - 3rem)
    display: flex
    align-items: center
    padding-left: 1rem
    border-radius: 4px
    background-color: $setting-background-color
    color: $text-color

  .user-modal-tags-icon
    transition: color .2s
    margin-left: 2rem
    margin-right: 1.5rem

  .user-modal-tag-icon
    margin-left: 1rem
    margin-right: 2rem

  .user-modal-plus-icon
    margin-left: 2rem
    margin-right: 1.5rem

  input
    border: none
    width: calc(100% - 5rem)

.user-modal-icon--gray
  color: gray

.non-clickable
  cursor: default !important

.user-modal-icon-wrap
  margin: 0 0.25rem

.user-modal-tag-status-icon[role="button"]
.user-modal-tags-icon[role="button"]
  cursor: pointer
</style>
