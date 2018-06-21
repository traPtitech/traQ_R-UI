<template lang="pug">
div.user
  modal(@close="closeModal" :active="active")
    div.user-modal
      div.user-modal-main-container
        div.user-modal-img(:style="profileContainerStyle")
        div.user-modal-gradient(:style="gradientStyle")
        div.user-modal-profile-container
          div.user-modal-dm(v-on:click="openDirectMessage")
            div.user-modal-dm-indicator(v-if="hasUnreadMessages")
            icon.user-modal-dm-icon-envelope(name="envelope" scale="1.5")
            div.user-modal-button
              | Direct Message
          hr
          div.user-modal-profile(v-on:click="toggleExpandProfile")
            div.user-modal-display-name
              | {{model.displayName}}
            div.user-modal-real-name-container
              div.user-modal-real-name
                | Real Name
              div.user-modal-grade
                | 16B
            div.user-modal-name-container-expand(v-if="expandProfile")
              div.user-modal-name
                | @{{model.name}}
              div.user-modal-online-status
                div.user-modal-online-indicator(:style="onlineIndicatorStyle")
                div
                  div.user-modal-online-status-abstract
                    | Online
                  div.user-modal-online-status-detail
                    | Last: 10/10 20:20
              div.user-modal-links
                a.user-modal-link-content(:href="wikiUserPageUrl")
                  icon(name="book")
                  div.user-modal-link-description Wiki Page
                a.user-modal-link-content(:href="twitterProfileUrl" :style="twitterLinkStyle")
                  icon(name="brands/twitter")
                  div.user-modal-link-description(v-if="twitterProfileUrl") @{{ model.twitterId }}
            div.user-modal-name-container(v-else)
              div.user-modal-online-indicator(:style="onlineIndicatorStyle")
              div.user-modal-name
                | @{{model.name}}
              div.user-modal-online-status(v-if="expandProfile")
                | Online
              a(:href="wikiUserPageUrl")
                icon(name="book")
              a(:href="twitterProfileUrl")
                icon(name="brands/twitter" :style="twitterLinkStyle")
      div.user-modal-detail-container
        ModalHeaderCenterAligned(title="TAGS" faIconName="tags")
        div.user-modal-detail.user-modal-tag
          div.user-modal-tag-element(v-for="(tag, index) in tags")
            div.user-modal-icon--gray.user-modal-tag-icon
              icon(name="tag")
            div.user-modal-tag-body(v-on:click="openTagModal(tag.tagId)")
              | {{tag.tag}}
            div.user-modal-tag-status-icon(v-if="tag.editable")
              icon.user-modal-icon--gray(name="lock-open" v-show="hasAuth && !tag.isLocked" v-on:click="lockTag(index)")
              icon.user-modal-icon--gray(name="times" v-show="!tag.isLocked" v-on:click="eraseTag(index)")
              icon.user-modal-icon--gray(name="lock" v-show="hasAuth && tag.isLocked" v-on:click="unlockTag(index)")
              icon.user-modal-icon--gray.non-clickable(name="lock" v-show="!hasAuth && tag.isLocked")
        div.user-modal-detail-input-container
          div.user-modal-detail-input
            icon.user-modal-icon--gray.user-modal-tag-icon(name="tag" :style="detailInputIconStyle")
            input.user-modal-tag-body(v-model="tagInput" v-on:keydown="keydown" placeholder="タグを追加……")
            icon.user-modal-icon--gray.user-modal-plus-icon(name="plus" v-on:click="addTag" :style="detailInputIconStyle")
</template>

<script>
import client from '@/bin/client'
import ModalHeaderCenterAligned from '@/components/Util/ModalHeaderCenterAligned'
export default {
  name: 'User',
  components: {
    ModalHeaderCenterAligned
  },
  data () {
    return {
      tagInput: '',
      expandProfile: false
    }
  },
  methods: {
    closeModal () {
      this.$store.commit('closeUserModal')
      this.expandProfile = false
    },
    openTagModal (tagId) {
      this.$store.dispatch('openTagModal', tagId)
    },
    keydown (event) {
      if (event.key === 'Enter' && (event.ctrlKey || event.metaKey || event.shiftKey)) {
        this.addTag()
        event.returnValue = false
      }
    },
    addTag () {
      if (this.tagInput === '') {
        return
      }
      client.addUserTag(this.model.userId, this.tagInput)
      .then(() => {
        this.tagInput = ''
      })
    },
    eraseTag (id) {
      client.deleteUserTag(this.model.userId, this.tags[id].tagId)
    },
    lockTag (id) {
      client.changeLockUserTag(this.model.userId, this.tags[id].tagId, true)
    },
    unlockTag (id) {
      client.changeLockUserTag(this.model.userId, this.tags[id].tagId, false)
    },
    openDirectMessage () {
      this.$router.push(`/users/${this.model.name}`)
      this.closeModal()
    },
    toggleExpandProfile () {
      this.expandProfile = !this.expandProfile
    }
  },
  computed: {
    directMessageChannel () {
      if (this.model.userId === this.$store.state.me.userId) {
        return this.$store.getters.getDirectMessageChannels.find(channel => channel.member && channel.member.length === 1)
      } else {
        return this.$store.getters.getDirectMessageChannels.find(channel => channel.member && channel.member.some(userId => userId === this.model.userId))
      }
    },
    hasUnreadMessages () {
      if (this.directMessageChannel) {
        return this.$store.getters.getChannelUnreadMessageNum(this.directMessageChannel.channelId) > 0
      } else {
        return false
      }
    },
    active () {
      if (this.$store.state.userModal) {
        return true
      } else {
        return false
      }
    },
    model () {
      return this.$store.state.userModal || {}
    },
    tags () {
      const current = this.$store.state.currentUserTags
      return current.filter(tag => !tag.editable).concat(current.filter(tag => tag.editable))
    },
    hasAuth () {
      if (this.$store.state.userModal) {
        return this.$store.state.userModal.name === this.$store.state.me.name
      }
      return false
    },
    wikiUserPageUrl () {
      return `https://wiki.trapti.tech/user/${this.model.name}`
    },
    twitterProfileUrl () {
      return this.model.twitterId !== '' ? `https://twitter.com/${this.model.twitterId}` : null
    },
    profileContainerStyle () {
      return {
        backgroundImage: `url(${this.$store.state.baseURL}/api/1.0/users/${this.model.userId}/icon)`
      }
    },
    onlineIndicatorStyle () {
      if (this.model.isOnline) {
        return {
          backgroundColor: '#27ae60'
        }
      } else {
        return {
          border: '1px solid lightgray'
        }
      }
    },
    twitterLinkStyle () {
      return {
        color: this.twitterProfileUrl ? 'rgba(255, 255, 255, 1.0)' : 'rgba(255, 255, 255, 0.5)'
      }
    },
    detailInputIconStyle () {
      return {
        color: this.tagInput.length > 0 ? 'gray' : 'lightgray'
      }
    },
    gradientStyle () {
      return {
        background: `linear-gradient(180deg, rgba(156, 178, 203, 0.38674) 0%, #003778 100%)`
      }
    }
  }
}
</script>
<style lang="sass">
$modal-height: 600px
$modal-max-height: 90vh
$modal-min-height: 70vh
$profile-area-height: 40vh

.user .modal
  width: 80%

.user-modal
  display: grid
  height: $modal-height
  max-height: $modal-max-height
  min-height: $modal-min-height
  @media (orientation: landscape)
    grid-template-columns: minmax(200px, auto) 55%
    grid-template-areas: "profile detail"
  @media (orientation: portrait)
    grid-template-rows: $profile-area-height calc(100% - #{$profile-area-height})
    grid-template-areas: "profile""detail"

  .user-modal-main-container
    grid-area: profile
    position: relative
    display: flex
    justify-content: center
    height: 100%
    max-height: $modal-max-height
    .user-modal-img
      position: absolute
      height: 100%
      width: 100%
      z-index: -1
      background-repeat: no-repeat
      background-position: center
      background-size: cover
    .user-modal-gradient
      position: absolute
      width: 100%
      height: 100%
      z-index: -1
      transition: all ease 0.3s
    .user-modal-profile-container
      display: grid
      @media (orientation: landscape)
        grid-template-rows: 1fr 2rem auto
      @media (orientation: portrait)
        grid-template-rows: unset
      width: calc(100% - 4rem)
      flex-direction: column
      color: white
      margin-bottom: 1.5rem
      .user-modal-dm
        display: flex
        align-items: center
        justify-content: center
        align-self: center
        height: 100%
        cursor: pointer
        @media (min-width: 680px)
          font-size: 1.75rem
        @media (max-width: 679px)
          font-size: 1.2rem
        @media (orientation: portrait)
          display: none
        .user-modal-dm-icon-envelope
          margin-right: 0.75em
        .user-modal-dm-indicator
          $indicator-size: 0.4em
          position: absolute
          height: $indicator-size
          width: $indicator-size
          transform: translate(calc(-#{$indicator-size} / 2), calc(-#{$indicator-size} / 6))
          border-radius: 50%
          background: #EB5757
      hr
        width: 100%
        @media (orientation: portrait)
          display: none
      .user-modal-profile
        display: flex
        flex-direction: column
        justify-content: flex-end
        margin-bottom: 0.5rem
      .user-modal-display-name
        font-size: 2rem
        margin: 0.2rem 0px
      .user-modal-real-name-container
        display: flex
        align-items: center
        margin: 0.3rem 0px 0.6rem 0.2rem
        .user-modal-real-name
          margin-right: 1rem
        .user-modal-grade
          display: flex
          align-items: center
          justify-content: center
          font-size: 0.9rem
          height: 1.3rem
          width: 2.5rem
          border: 1px solid white
      .user-modal-name-container
        display: grid
        align-items: center
        margin-left: 0.2rem
        grid-template-columns: 1.5rem max-content 2rem 2rem
        a
          margin-top: 0.3rem
          color: rgba(255, 255, 255, 1.0)
      .user-modal-name-container-expand
        .user-modal-online-status
          display: grid
          align-items: center
          margin: 0.6rem 0px 0px 0.2rem
          grid-template-columns: 1.5rem 1fr
          .user-modal-online-status-abstract
            display: inline-block
            margin-right: 0.5rem
          .user-modal-online-status-detail
            display: inline-block
            font-size: 0.8rem
            color: rgba(255, 255, 255, 0.7)
        .user-modal-links
          margin-top: 1.2rem
          display: flex
          .user-modal-link-content
            display: grid
            grid-template-columns: 1rem 1fr
            grid-gap: 0.5rem
            margin-right: 1rem
            color: rgba(255, 255, 255, 1.0)
            .user-modal-link-description
              @media (max-width: 360px)
                display: none

      // shared within user-modal-name-container and user-modal-name-container-expand
      .user-modal-online-indicator
        width: 0.6rem
        height: 0.6rem
        border-radius: 50%
      .user-modal-name
        font-size: 1.2rem
        margin-right: 2rem
        margin-bottom: 0.1rem

  .user-modal-detail-container
    $header-height: 5rem
    $header-height-narrow: 4rem
    $input-height: 4rem
    height: 100%
    grid-area: detail
    display: grid
    @media (orientation: landscape)
      grid-template-rows: $header-height calc(100% - #{$header-height} - #{$input-height}) $input-height
      height: inherit
      max-height: $modal-max-height
    @media (orientation: portrait)
      grid-template-rows: $header-height-narrow calc(100% - #{$header-height-narrow} - #{$input-height}) $input-height
      height: 100%

    .user-modal-detail
      overflow-y: scroll
      height: 100%
      box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1)

    .user-modal-detail-input-container
      display: flex
      align-items: center
      justify-content: center
      .user-modal-detail-input
        height: 2.2rem
        width: calc(100% - 3rem)
        display: flex
        align-items: center
        background: white
        border: 1px solid lightgray
        .user-modal-icon--gray
          transition: color .2s
        .user-modal-tag-icon
          margin-left: 1rem
          margin-right: 2rem
        input
          border: none
          width: calc(100% - 5rem)
        .user-modal-plus-icon
          margin-left: 2rem
          margin-right: 1.5rem

.user-modal-tag-element
  $gap: 1rem
  display: grid
  grid-template-columns: 2rem calc(100% - 6rem - 1rem * 2) 4rem
  grid-gap: $gap
  @media (orientation: landscape)
    margin: 1.3rem 2.5rem
  @media (orientation: portrait)
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
    > .user-modal-icon--gray
      margin: 0px 0.5rem
      cursor: pointer

.user-modal-icon--gray
  color: gray
.user-modal-icon--blue
  color: #3a4891
.non-clickable
  cursor: default !important
</style>
