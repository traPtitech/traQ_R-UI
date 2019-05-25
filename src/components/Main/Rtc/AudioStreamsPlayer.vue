<template lang="pug">
.audio-streams-player
  audio(v-for="stream in remoteAudioStreams" :data-user="stream.peerId")
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'AudioStreamsPlayer',
  computed: {
    ...mapGetters('rtc', ['remoteAudioStreams'])
  },
  watch: {
    async remoteAudioStreams(oldStreams, newStreams) {
      await this.$nextTick
      this.$el.childNodes.forEach(el => {
        if (!(el instanceof HTMLAudioElement) || el.srcObject) {
          return
        }
        el.srcObject = this.$store.state.rtc.remoteAudioStreamMap[
          el.dataset['user']
        ]
        el.play()
      })
    }
  }
}
</script>

<style lang="sass"></style>
