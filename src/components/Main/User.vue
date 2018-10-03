<template lang="pug">
div.user
  modal(@close="closeModal" :active="active")
    div.user-modal(:data-is-expanded="expandProfile ? 'true' : 'false'" @click="toggleExpandProfile")
      div.user-modal-main-container
        div.user-modal-img(:style="profileImgStyle")
          div.user-modal-dm(@click="openDirectMessage")
            div.user-modal-dm-indicator(v-if="!hasUnreadMessages")
            icon.user-modal-dm-icon-envelope(name="envelope" scale="1.5")
        div.user-modal-profile-container
          div.user-modal-profile
            div.user-modal-display-name
              | {{model.displayName}}
            div.user-modal-real-name-container
              div.user-modal-real-name
                | Real Name
              div.user-modal-grade
                | {{grade}}
            div.user-modal-name-container-expand(v-if="expandProfile")
              div.user-modal-name
                | @{{model.name}}
              div.user-modal-online-status
                div.user-modal-online-indicator(:style="onlineIndicatorStyle")
                div
                  div.user-modal-online-status-abstract
                    | Online
                  div.user-modal-online-status-detail
                    | Last: {{lastOnline}}
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
          div.user-modal-tag-element(v-for="(tag, index) in tags" :key="tag.tagId")
            div.user-modal-icon--gray.user-modal-tag-icon
              icon(name="tag")
            div.user-modal-tag-body(v-on:click="openTagModal(tag.tagId)")
              | {{tag.tag}}
            div.user-modal-tag-status-icon(v-if="tag.editable")
              div(v-on:click="lockTag(index)")
                icon.user-modal-icon--gray(name="lock-open" v-show="hasAuth && !tag.isLocked")
              div(v-on:click="eraseTag(index)")
                icon.user-modal-icon--gray(name="times" v-show="!tag.isLocked")
              div(v-on:click="unlockTag(index)")
                icon.user-modal-icon--gray(name="lock" v-show="hasAuth && tag.isLocked")
              icon.user-modal-icon--gray.non-clickable(name="lock" v-show="!hasAuth && tag.isLocked")
        .user-modal-detail-input-container
          div.user-modal-detail-input
            icon.user-modal-icon--gray.user-modal-tag-icon(name="tag" :style="detailInputIconStyle")
            input.user-modal-tag-body(v-model="tagInput" v-on:keydown="keydown" placeholder="タグを追加……")
            div(v-on:click="addTag")
              icon.user-modal-icon--gray.user-modal-plus-icon(name="plus" :style="detailInputIconStyle")
</template>

<script>
import client from '@/bin/client'
import ModalHeaderCenterAligned from '@/components/Util/ModalHeaderCenterAligned'
function paddingNumber (n, k) {
  let ret = `${n}`
  for (let i = 0; i < k; i++) ret = '0' + ret
  return ret.slice(-k)
}
function dateParse (date) {
  return `${date.getFullYear()}/${paddingNumber(date.getMonth(), 2)}/${paddingNumber(date.getDate(), 2)} ${paddingNumber(date.getHours(), 2)}:${paddingNumber(date.getMinutes(), 2)}`
}
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
        this.$store.dispatch('updateCurrentUserTags')
      })
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
    profileImgStyle () {
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
    lastOnline () {
      return dateParse(new Date(this.model.lastOnline))
    },
    grade () {
      const tag = this.tags.find(tag => /^\d{2}[BMDR]$/.test(tag.tag))
      if (tag) {
        return tag.tag
      } else {
        return '___'
      }
    }
  }
}
</script>
<style lang="sass">
$modal-height: 600px
$modal-border-radius: 10px
$modal-max-height: 90vh
$modal-min-height: 70vh
$profile-area-height: 30vh

.user .modal
  border-radius: $modal-border-radius
  width: 90%
  +mq
    width: 80%

.user-modal
  display: grid
  height: $modal-height
  max-height: $modal-max-height
  min-height: $modal-min-height
  width: 100%
  grid-template-columns: 100%
  transition: all 1s ease
  @media (orientation: landscape)
    grid-template-columns: minmax(200px, auto) 65%
    grid-template-areas: "profile detail"
  @media (orientation: portrait)
    grid-template-rows: $profile-area-height calc(100% - #{$profile-area-height})
    grid-template-areas: "profile""detail"

  .user-modal-main-container
    @media (orientation: landscape)
      border-radius: $modal-border-radius 0 0 $modal-border-radius
    @media (orientation: portrait)
      border-radius: $modal-border-radius $modal-border-radius 0 0
    grid-area: profile
    padding: 0 1rem
    position: relative
    display: flex
    align-items: center
    justify-content: center
    height: 100%
    max-height: $modal-max-height
    background: $primary-color
    @media (orientation: landscape)
      flex-direction: column
    @media (orientation: portrait)
      flex-direction: row

    .user-modal-img
      flex-shrink: 0
      position: relative
      @media (orientation: landscape)
        height: 10rem
        width: 10rem
      @media (orientation: portrait)
        height: 5rem
        width: 5rem
        margin: 0 2rem 0 0
      border-radius: 50%
      border: 3px solid white
      background-repeat: no-repeat
      background-position: center
      background-size: cover
      background-color: white

      .user-modal-dm
        position: absolute
        @media (orientation: landscape)
          bottom: 0
          right: -0.75rem
        @media (orientation: portrait)
          bottom: -0.25rem
          right: -1rem
        height: min-content
        display: flex
        align-items: center
        justify-content: center
        cursor: pointer
        color: white
        .user-modal-dm-indicator
          =user-modal-dm-indicator-style($indicator-size, $indicator-border-width)
            position: absolute
            height: $indicator-size
            width: $indicator-size
            top: - $indicator-size / 3
            left: - 2 * $indicator-size / 3
            border: $indicator-border-width solid white
            border-radius: 50%
            background: #EB5757
          @media (orientation: landscape)
            +user-modal-dm-indicator-style(0.75rem, 2px)
          @media (orientation: portrait)
            +user-modal-dm-indicator-style(0.5rem, 1px)
        .user-modal-dm-icon-envelope
          height: auto
          @media (orientation: landscape)
            width: 1.75rem
          @media (orientation: portrait)
            width: 1.25rem

    .user-modal-profile-container
      display: grid
      @media (orientation: landscape)
        grid-template-rows: 1fr 2rem auto
      @media (orientation: portrait)
        grid-template-rows: unset
      width: calc(100% - 4rem)
      flex-direction: column
      color: white
      margin-top: 1.5rem
      .user-modal-profile
        display: flex
        flex-direction: column
        justify-content: flex-end
        margin-bottom: 0.5rem
      .user-modal-display-name
        font-size: 1.5rem
        font-weight: 600
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

.user-modal[data-is-expanded="true"]
  @media (orientation: landscape)
    grid-template-columns: minmax(200px, auto) 65%
    grid-template-areas: "profile detail"
  @media (orientation: portrait)
    grid-template-rows: 100% 0
    grid-template-areas: "profile""detail"

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
