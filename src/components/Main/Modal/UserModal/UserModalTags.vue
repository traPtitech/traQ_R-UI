<template lang="pug">
.user-modal-tags
  .user-modal-tags-container
    .user-modal-tag-element(v-for="(tag, index) in tags" :key="tag.tagId")
      .user-modal-icon--gray.user-modal-tag-icon
        icon(name="tag")
      .user-modal-tag-body(@click="openTagModal(tag.tagId)")
        | {{tag.tag}}
      .user-modal-tag-status-icon(v-if="tag.editable")
        div(@click="lockTag(index)")
          icon.user-modal-icon--gray(name="lock-open" v-show="hasAuth && !tag.isLocked")
        div(@click="eraseTag(index)")
          icon.user-modal-icon--gray(name="times" v-show="!tag.isLocked")
        div(@click="unlockTag(index)")
          icon.user-modal-icon--gray(name="lock" v-show="hasAuth && tag.isLocked")
        icon.user-modal-icon--gray.non-clickable(name="lock" v-show="!hasAuth && tag.isLocked")
  .user-modal-tags-input-container
    icon.user-modal-tags-icon(
      name="tag"
      :style="detailInputIconStyle"
    )
    input.user-modal-tags-input(
      v-model="tagInput"
      @keydown="onInputChange"
      placeholder="タグを追加……"
    )
    div(@click="addTag")
      icon.user-modal-tags-icon(
        name="plus"
       :style="detailInputIconStyle"
     )
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import client from '@/bin/client'

export default {
  name: 'UserModalTags',
  data () {
    return {
      tagInput: ''
    }
  },
  computed: {
    ...mapState('modal', ['data']),
    ...mapGetters('modal', {
      tags: 'currentUserTagsSorted'
    }),
    hasAuth () {
      if (this.data) {
        return this.data.name === this.$store.state.me.name
      }
      return false
    },
    detailInputIconStyle () {
      return {
        color: this.tagInput.length > 0 ? 'gray' : 'lightgray'
      }
    }
  },
  methods: {
    openTagModal (tagId) {
      this.$store.dispatch('openTagModal', tagId)
    },
    onInputChange (event) {
      if (event.key === 'Enter' && (event.ctrlKey || event.metaKey || event.shiftKey)) {
        this.addTag()
        event.returnValue = false
      }
    },
    addTag () {
      console.log(this.tagInput)
      if (this.tagInput === '') {
        return
      }
      client.addUserTag(this.data.userId, this.tagInput)
      .then(() => {
        this.tagInput = ''
        this.$store.dispatch('modal/updateCurrentUserTags')
      })
    },
    eraseTag (id) {
      client.deleteUserTag(this.data.userId, this.tags[id].tagId)
      .then(() => {
        this.$store.dispatch('modal/updateCurrentUserTags')
      })
    },
    lockTag (id) {
      client.changeLockUserTag(this.data.userId, this.tags[id].tagId, true)
      .then(() => {
        this.$store.dispatch('modal/updateCurrentUserTags')
      })
    },
    unlockTag (id) {
      client.changeLockUserTag(this.data.userId, this.tags[id].tagId, false)
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
    margin: 1.3rem 2.5rem
  +mq(sp)
    margin: 1rem 2rem

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

    .user-modal-icon--gray
      margin: 0px 0.5rem
      cursor: pointer

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
    background: white
    border: 1px solid lightgray

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
</style>
