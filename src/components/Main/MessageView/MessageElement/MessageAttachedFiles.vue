<template lang="pug">
  div.message-files-wrap
    div.message-file-wrap(v-for="file in files")
      div.message-file-inner-wrap(v-if="file.fileId !== ''")
        div(v-if="isGif(file.mime)")
          img.attached-image(
            :src="`${fileUrl(file.fileId)}/thumbnail`" 
            :onClick="`this.src = '${fileUrl(file.fileId)}'`" 
            :alt="file.name")
        .attached-image(v-else-if="isSvg(file.mime)"
          :style="backgroundImageStyle(`${fileUrl(file.fileId)}`)"
          @click.prevent="onAttachedImageClick(file)")
        .attached-image(
          v-else-if="isImage(file.mime)" 
          @click.prevent="onAttachedImageClick(file)"
          :style="backgroundImageStyle(`${fileUrl(file.fileId)}/thumbnail`)")
        video.attached-video(
          v-else-if="isVideo(file.mime)" 
          :src="fileUrl(file.fileId)" 
          :alt="file.name" 
          preload="none" 
          controls)
        audio.attached-audio(
          v-else-if="isAudio(file.mime)" 
          :src="fileUrl(file.fileId)" 
          :alt="file.name" 
          preload="none" 
          controls)

        a.attached-file-info(
          :href="`${fileUrl(file.fileId)}?dl=1`" 
          :download="file.name")
          div.attached-file-info-icon-wrap
            icon-attach(:size="24" color="var(--tertiary-color-on-bg)")
          div
            p.attached-file-name.break-text
              | {{file.name}}
            p.attached-file-size
              | {{encodeByte(file.size)}}
      div(v-else)
        div.attached-file-not-found
          p
            | File Not Found
</template>

<script>
import { mapGetters } from 'vuex'
import {
  encodeByte,
  isImage,
  isGif,
  isSvg,
  isVideo,
  isAudio
} from '@/bin/utils.js'
import IconAttach from '@/components/Icon/IconAttach'

export default {
  name: 'MessageAttachedFiles',
  props: {
    files: {
      type: Array,
      required: true
    }
  },
  components: { IconAttach },
  computed: {
    ...mapGetters(['fileUrl'])
  },
  methods: {
    encodeByte,
    isImage,
    isGif,
    isSvg,
    isVideo,
    isAudio,
    onAttachedImageClick(file) {
      this.$store.dispatch('openFileModal', file)
    },
    backgroundImageStyle(url) {
      return {
        backgroundImage: `url(${url})`
      }
    }
  }
}
</script>

<style lang="sass">
.message-files-wrap
  margin:
    top: 12px
    left: 10px

.message-file-wrap:not(:first-child)
  margin:
    top: 16px

.message-file-inner-wrap
  display: inline-flex
  flex-flow: column

.attached-image-wrap
  display: block
  max-width: 250px
  max-height: 480px

.attached-image
  cursor: pointer
  background:
    size: cover
    position: center center
    repeat: no-repeat
  width: 250px
  height: 150px
  border:
    color: var(--tertiary-color-on-bg)
    style: solid
    width: 1px
    radius: 6px

.attached-video
  max-width: 360px
  max-height: 480px
  width: 100%
  background-color: #000000

.attached-file-info
  display: inline-flex
  flex-flow: row
  color: var(--tertiary-color-on-bg)
  border:
    color: var(--tertiary-color-on-bg)
    style: solid
    width: 1px
    radius: 6px
  margin:
    top: 6px
  padding: 8px 12px 8px
  background-color: var(--background-color)

.attached-file-info-icon-wrap
  width: 32px
  display: flex
  flex-shrink: 0
  align-items: center

.attached-file-name

.attached-file-size
  margin:
    top: 4px
  font:
    size: 0.8em
  opacity: 0.8

.attached-file-not-found
  display: inline-flex
  color: var(--warning-color)
  border:
    color: var(--warning-color)
    style: solid
    width: 1px
    radius: 6px
  padding: 8px 12px 8px
  background-color: var(--background-color)
</style>
