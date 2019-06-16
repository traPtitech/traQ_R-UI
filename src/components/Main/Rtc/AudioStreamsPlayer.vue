<template lang="pug">
.audio-streams-player
  audio(
    v-for="stream in remoteAudioStreams"
    :data-user="stream.peerId"
    :ref="stream.peerId"
  )
</template>

<script>
import { mapGetters, mapState } from 'vuex'
export default {
  name: 'AudioStreamsPlayer',
  computed: {
    ...mapState('rtc', ['userVolumeMap']),
    ...mapGetters('rtc', ['remoteAudioStreams'])
  },
  watch: {
    async remoteAudioStreams() {
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
    },
    async userVolumeMap() {
      await this.$nextTick
      const userVolumeMap = this.$store.state.rtc.userVolumeMap
      Object.keys(this.$refs).forEach(userId => {
        const audio =
          this.$refs[userId].length && this.$refs[userId].length > 0
            ? this.$refs[userId][0]
            : this.$refs[userId]
        if (!(audio instanceof HTMLAudioElement)) {
          return
        }
        const volume = userVolumeMap[userId]
        console.log(`[RTC] Will change volume of ${userId} to ${volume}`)
        audio.volume = volume
      })
    }
  }
}
</script>

<style lang="sass"></style>
