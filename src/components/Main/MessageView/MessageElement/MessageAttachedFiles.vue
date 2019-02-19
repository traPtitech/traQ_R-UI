<template lang="pug">
  div.message-files-wrap
    div.message-file-wrap(v-for="file in files")
      div(v-if="file.fileId !== ''")
        div(v-if="isGif(file.mime)")
          img.attached-image(
            :src="`${fileUrl(file.fileId)}/thumbnail`" 
            @click="playGif(file, $event)" 
            :alt="file.name")
        a(
          v-else-if="isImage(file.mime)" 
          :href="fileUrl(file.fileId)" 
          target="_blank" 
          rel="nofollow noopener noreferrer")
          img.attached-image(
            :src="`${fileUrl(file.fileId)}/thumbnail`" 
            :alt="file.name")
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
            p.attached-file-name
              | {{file.name}}
            p.attached-file-size
              | {{encodeByte(file.size)}}
      div(v-else)
        p
          | Not Found
</template>

<script>
import {mapGetters} from 'vuex'
import {encodeByte, isImage, isGif, isVideo, isAudio} from '@/bin/utils.js'
import IconAttach from '@/components/Icon/IconAttach'

export default {
  name: 'MessageAttachedFiles',
  props: {
    files: {
      type: Array,
      required: true
    }
  },
  components: {IconAttach},
  computed: {
    ...mapGetters([
      'fileUrl'
    ])
  },
  methods: {
    encodeByte,
    isImage,
    isGif,
    isVideo,
    isAudio,
    playGif (file, e) {
      console.log(e)
    }
  }
}
</script>

<style lang="sass">
.message-files-wrap
  margin:
    top: 12px
    left: 10px

.message-file-wrap
  margin:
    top: 16px

.attached-image
  max-width: 250px
  max-height: 480px
  width: 100%
  display: block
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

</style>
