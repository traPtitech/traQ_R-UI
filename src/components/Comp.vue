<template>
  <div>
    <textarea cols="50" rows="10" id="text" v-model="input"></textarea>
    <p v-for="elem in candidates">
      {{elem}}
    </p>
    <p> {{selectIndex}} </p>
  </div>
</template>

<script>
import comp from '@/bin/completion'

export default {
  name: 'Comp',
  data () {
    return {
      input: '',
      selectIndex: 0,
      dummy: 0
    }
  },
  methods: {
    stealKeyEvent: function () {
      // disabling key event ↑, ↓, enter
      let self = this
      document.getElementById('text').onkeydown = function () {
        if (event.keyCode === 38 || event.keyCode === 40) {
          self.selectIndex += event.keyCode - 39
          if (self.selectIndex >= self.candidates.length) self.selectIndex = self.candidates.length - 1
          if (self.selectIndex < 0) self.selectIndex = 0
          event.returnValue = false
        } else if (event.keyCode === 13) {
          self.replaceSuggest()
          event.returnValue = false
          self.unStealKeyEvent()
          setTimeout(function () {
            self.dummy ^= 1
          }, 10)
        } else {
          self.unStealKeyEvent()
          setTimeout(function () {
            self.dummy ^= 1
          }, 10)
        }
      }
    },
    unStealKeyEvent: function () {
      // release key event
      let self = this
      // funvtion to calculate this.candidates
      document.getElementById('text').onkeydown = function () {
        self.dummy ^= 1
      }
    },
    replaceSuggest: function () {
      let selectionStart = document.getElementById('text').selectionStart
      let strs = this.input.substr(0, selectionStart).split('#')
      let key = strs[strs.length - 1]
      let secondStr = this.input.substr(selectionStart, this.input.length)

      // replace key with candidates[index]
      let replaced = ''
      for (let i = 0; i < strs.length - 1; i++) {
        replaced += strs[i] + '#'
      }
      let index = this.selectIndex
      replaced += this.candidates[index] + ' ' + secondStr
      this.input = replaced

      // change cursor position
      let replacedSelectionStart = selectionStart + this.candidates[index].length - key.length + 1
      setTimeout(function () {
        document.getElementById('text').selectionEnd = document.getElementById('text').selectionStart = replacedSelectionStart
      }, 10)
    }
  },
  computed: {
    candidates: function () {
      if (this.input.length === 0) {
        return []
      }
      if (!document.getElementById('text')) {
        return []
      }
      if (this.dummy < 0) {
        return []
      }
      this.unStealKeyEvent()

      let selectionStart = document.getElementById('text').selectionStart
      let selectionEnd = document.getElementById('text').selectionEnd

      // range selection
      if (selectionStart !== selectionEnd) {
        return []
      }
      let strs = this.input.substr(0, selectionStart).split('#')
      // has no '#'
      if (strs.length < 2) {
        return []
      }
      let key = strs[strs.length - 1]
      if (key.length === 0) {
        return []
      }

      this.selectIndex = 0
      let ret = comp(key, channels, 3)
      if (ret.length > 0) this.stealKeyEvent()
      return ret
    }
  }
}

const channels = [
  '17_2',
  '17_2/ClayPlatesStory',
  '17_2/Flythm',
  '17_2/Inverse',
  '17_2/NinjaFlicker',
  '17_2/ShapeSphere2',
  '17_2/SkyHighFight',
  '17_2/TODOList',
  '17_2/touhou',
  '17_2/traQ',
  'event',
  'general',
  'general/executive',
  'general/meeting',
  'general/schedule',
  'gps',
  'gps/buri',
  'random',
  'random/discussion',
  'random/progress',
  'team',
  'traQ',
  'univ'
]
</script>

<style scoped>

</style>
