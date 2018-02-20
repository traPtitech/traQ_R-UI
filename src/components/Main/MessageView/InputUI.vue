<template lang="pug">
div.input-ui
  //- div.upload-button(v-if="isOpened")
  div.submit-button(v-show="isOpened")
  div.input-area-wrapper
    textarea.input-area(v-show="isOpened" v-on:blur="inputBlur()" v-model="inputText" :class="{'input-area-opened': isOpened}" ref="inputArea" placeholder="進捗どうですか")
  div.input-background.input-appeared.input-background-gradation(v-on:click="isOpened = !isOpened;focus()" :class="{'input-background-opened': isOpened}")
</template>

<script>
export default {
  data () {
    return {
      isOpened: false,
      inputText: ''
    }
  },
  methods: {
    focus: function () {
      if (!this.isOpened) {
        return
      }
      this.$nextTick(
        function () {
          this.$refs.inputArea.focus()
        }
      )
    },
    inputBlur: function () {
      if (this.inputText === '') {
        this.isOpened = false
      }
    }
  },
  watch: {
    inputAreaHeight: function () {
      console.log(this.$refs.inputArea.scrollHeight)
      return this.$refs.inputArea.scrollHeight + 'px'
    }
  },
  computed: {

  }
}
</script>

<style lang="sass">
.input-ui
  position: absolute
  width: 100%
  height: 100%
  bottom: 0
  pointer-events: none
.upload-button
  position: absolute
  z-index: 200
  width: 40px
  height: 40px
  background-color: rgb(207, 207, 207)
  bottom: 10px
  left: 5px
.submit-button
  position: absolute
  z-index: 200
  width: 40px
  height: 40px
  background-color: rgb(207, 207, 207)
  bottom: 10px
  right: 5px
.input-area-wrapper
  width: 100%
  max-height: 150px
  overflow-x: hidden
  overflow-y: scroll
  position: absolute
  right: 0
  left: 0
  bottom: 0
  border-top: solid 1px rgba(0, 0, 0, 0.5)
.input-area
  box-sizing: border-box
  z-index: 100
  width: 100%
  height: 60px
  margin: 0
  padding: 0
  background: none
  resize: none
  -webkit-appearance: none
  padding: 10px 60px 10px 10px
  font-size: 1.1em
  cursor: text
  border: 0
  line-height: 1
  animation: openInputArea 1s ease
.input-area:focus
  outline: 0
.input-area::placeholder
  color: rgba(0, 0, 0, 0.5)
.input-area-opened
@keyframes openInputArea
  0%
    opacity: 0
  100%
    opacity: 1
.input-background
  z-index: 10
  position: absolute
  text-align: center
  box-sizing: border-box
  color: white
  width: 60%
  max-width: 300px
  height: 25px
  bottom: 20px
  right: 0
  left: 0
  margin: auto
  // border: 2px solid white
  transition: all .2s cubic-bezier(0.645, 0.045, 0.355, 1)
  opacity: 1
  // border-image: linear-gradient(left,#41c7e0,#c27dec) 1 1 1 1
  // border-width: 3px
  // border-style: solid
  border-radius: 15px
  background-clip: content-box
  cursor: pointer
  &:hover
    box-shadow: 0 0 5px rgba(112, 112, 112, 1)
.input-appeared
  animation: input-background-appeared 1s ease
.input-background-gradation
  background: linear-gradient(95deg,#00E1FF,#e22af9)
  animation: input-background-gradient 20s ease infinite
  background-size: 200% 100%
@keyframes input-background-gradient
  0%
    background-position: 0% 50%
  50%
    background-position: 100% 50%
  100%
    background-position: 0% 50%
@keyframes input-background-appeared
  0%
    bottom: 10px
  100%
    bottom: 20px
.input-background-opened
  width: 100%
  max-width: 100%
  bottom: 0px
  height: 60px
  border-width: 0
  border-radius: 0
  opacity: 0
  z-index: -1
</style>
