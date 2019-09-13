<template lang="pug">
.input-slider
  .input-slider__track
  .input-slider__track-fill(:style="trackFillStyle")
  .input-slider__knob(:style="knobStyle")
  .input-slider__input-wrap
    input.input-slider__input(
      role="slider"
      type="range"
      :value="value"
      :min="min"
      :max="max"
      :step="step"
      @input="$emit('input', Number.parseInt($event.target.value))"
    )
</template>

<script>
export default {
  name: 'InputSlider',
  props: {
    value: {
      type: Number,
      required: true
    },
    min: {
      type: Number,
      default: 0
    },
    max: {
      type: Number,
      default: 100
    },
    step: {
      type: Number,
      default: 1
    }
  },
  computed: {
    ratio() {
      return this.value / (this.max - this.min)
    },
    trackFillStyle() {
      return {
        transform: `scaleX(${this.ratio})`
      }
    },
    knobStyle() {
      return {
        left: `${this.ratio * 100}%`
      }
    }
  }
}
</script>

<style lang="sass" scoped>
$slider-height: 16px
$slider-track-height: 2px
$slider-knob-size: 12px

.input-slider
  position: relative
  width: calc(100% - #{$slider-knob-size * 2})
  margin-left: $slider-knob-size / 2
  height: $slider-height

.input-slider__input-wrap
  position: relative
  width: calc(100% + #{$slider-knob-size})
  height: $slider-height

.input-slider__input
  position: absolute
  top: 0
  width: 100%
  opacity: 0
  margin: 0
  padding: 0
  -moz-appearance: none
  -webkit-appearance: none
  outline: none

.input-slider__track
  position: absolute
  top: ($slider-height - $slider-track-height) / 2
  left: $slider-knob-size / 2
  width: 100%
  height: $slider-track-height
  background-color: rgba(255, 255, 255, 0.5)
  border-radius: $slider-track-height / 2

.input-slider__track-fill
  position: absolute
  top: ($slider-height - $slider-track-height) / 2
  left: $slider-knob-size / 2
  width: 100%
  height: $slider-track-height
  background-color: white
  border-radius: $slider-track-height / 2
  transform-origin: top left

.input-slider__knob
  position: absolute
  top: ($slider-height - $slider-knob-size) / 2
  height: $slider-knob-size
  width: $slider-knob-size
  border-radius: 50%
  background-color: white
  cursor: pointer
</style>
