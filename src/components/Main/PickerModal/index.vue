<template lang="pug">
  .picker-modal(v-if="active")
    component(is="StampPicker")
</template>

<script>
import StampPicker from './StampPicker'

export default {
  name: 'PickerModal',
  data() {
    return {}
  },
  components: {
    StampPicker
  },
  computed: {
    active() {
      return this.$store.getters.stampPickerActive
    }
  },
  methods: {
    deactive() {
      this.$store.commit('setStampPickerActive', false)
    },
    listen: function(target, eventType, callback) {
      if (!this._eventRemovers) {
        this._eventRemovers = []
      }
      target.addEventListener(eventType, callback)
      this._eventRemovers.push({
        remove: function() {
          target.removeEventListener(eventType, callback)
        }
      })
    }
  },
  created: function() {
    this.$nextTick(() => {
      this.listen(
        window,
        'click',
        function(e) {
          if (!this.$el.contains(e.target)) {
            this.deactive()
          }
        }.bind(this)
      )
    })
  },
  destroyed: function() {
    if (this._eventRemovers) {
      this._eventRemovers.forEach(function(eventRemover) {
        eventRemover.remove()
      })
    }
  }
}
</script>

<style lang="sass">
.picker-modal
  border-radius: 10px
  width: 360px
  height: 60%
  max-height: 500px
  position: absolute
  background-color: $background-color
  box-shadow: 0 2px 3px rgba(0, 0, 0, 0.4)
  bottom: $input-height
  z-index: $picker-modal-index
  contain: strict

  +mq(pc)
    right: 20px
    bottom: 50px

  +mq(sp)
    width: 96vw
    left: 2vw
    right: 2vw
    bottom: $input-height
</style>
