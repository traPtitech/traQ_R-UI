<template>
  <div>
    <textarea cols="50" rows="10" id="text" v-model="input"></textarea>
    <p v-for="elem in searched.candidates">
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
      document.getElementById('text').onclick = function () {
        self.dummy ^= 1
      }
      document.getElementById('text').onkeydown = function () {
        if (event.keyCode === 38 || event.keyCode === 40) {
          self.selectIndex += event.keyCode - 39
          if (self.selectIndex >= self.searched.candidates.length) self.selectIndex = self.searched.candidates.length - 1
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
      // function to calculate this.candidates
      document.getElementById('text').onkeydown = function () {
        self.dummy ^= 1
      }
    },
    replaceSuggest: function () {
      let selectionStart = document.getElementById('text').selectionStart
      let strs = this.input.substr(0, selectionStart).split(this.searched.splitWord)
      let key = strs[strs.length - 1]
      let secondStr = this.input.substr(selectionStart, this.input.length)

      // replace key with candidates[index]
      let replaced = ''
      for (let i = 0; i < strs.length - 1; i++) {
        replaced += strs[i] + this.searched.splitWord
      }
      let index = this.selectIndex
      replaced += this.searched.candidates[index] + this.searched.suffix + secondStr

      // change cursor position
      let replacedSelectionStart = selectionStart + this.searched.candidates[index].length - key.length + this.searched.suffix.length
      this.input = replaced
      setTimeout(function () {
        document.getElementById('text').selectionEnd = document.getElementById('text').selectionStart = replacedSelectionStart
      }, 10)
    },
    searchChannnels: function (str) {
      let ret = {
        splitWord: '#',
        suffix: ' ',
        candidates: [],
        key: str
      }
      let splited = str.split('#')
      if (splited.length < 2) return ret
      let key = splited[splited.length - 1]
      if (key.length === 0) return ret
      ret.candidates = comp(key, words.channels, {
        multiKey: true,
        ignoreCaptal: true
      })
      return ret
    },
    searchIds: function (str) {
      let ret = {
        splitWord: '@',
        suffix: ' ',
        candidates: [],
        key: str
      }
      let splited = str.split('@')
      if (splited.length < 2) return ret
      let key = splited[splited.length - 1]
      // if (key.length === 0) return ret
      ret.candidates = comp(key, words.ids, {
        multiKey: false,
        ignoreCaptal: true
      })
      return ret
    },
    searchStamps: function (str) {
      let ret = {
        splitWord: ':',
        suffix: ':',
        candidates: [],
        key: str
      }
      let splited = str.split(':')
      if (splited.length < 2) return ret
      let key = splited[splited.length - 1]
      if (key.length === 0) return ret
      ret.candidates = comp(key, words.stamps, {
        multiKey: false,
        ignoreCaptal: true
      })
      return ret
    }
  },
  computed: {
    searched: function () {
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

      let str = this.input.substr(0, selectionStart)

      this.selectIndex = 0

      let ret
      ret = this.searchChannnels(str)
      if (ret.candidates.length > 0) {
        this.stealKeyEvent()
        return ret
      }
      ret = this.searchIds(str)
      if (ret.candidates.length > 0) {
        this.stealKeyEvent()
        return ret
      }
      ret = this.searchStamps(str)
      if (ret.candidates.length > 0) {
        this.stealKeyEvent()
        return ret
      }
      return ret
    }
  }
}

const words = {
  channels: {
    '17_2': ['17_2'],
    '17_2/ClayPlatesStory': ['ClayPlatesStory'],
    '17_2/Flythm': ['Flythm'],
    '17_2/Inverse': ['Inverse'],
    '17_2/NinjaFlicker': ['NinjaFlicker'],
    '17_2/ShapeSphere2': ['ShapeSphere2'],
    '17_2/SkyHighFight': ['SkyHighFight'],
    '17_2/TODOList': ['TODOList'],
    '17_2/touhou': ['touhou'],
    '17_2/traQ': ['traQ']
  },
  ids: {
    'a': null,
    'aa': null,
    'ab': null,
    'aaa': null,
    'aab': null,
    'aaaa': null,
    'aaab': null,
    'aba': null,
    'abb': null,
    'abba': null,
    'abbb': null,
    'b': null,
    'ba': null,
    'bb': null,
    'bbb': null,
    'bba': null,
    'bbbb': null,
    'bbbbb': null
  },
  stamps: {
    'koko': null,
    'po': null,
    'yami': null
  }
}
</script>

<style scoped>

</style>
