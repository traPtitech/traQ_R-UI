<template>
  <div>
    <textarea v-model="input"></textarea>
    <p v-for="elem in candidates">
      {{elem}}
    </p>
  </div>
</template>

<script>
import comp from '@/bin/completion'

export default {
  name: 'Comp',
  data () {
    return {
      input: '',
      inputPos: 0
    }
  },
  methods: {
  },
  computed: {
    candidates: function () {
      // textareaのselectionStart/selectionEndがほしい
      let str = this.input.substr(0, this.inputPos)
      // if (selectionStart !== selectionEnd) return []
      // let strs = this.input.substr(0, selectionStart).split('#')
      // str = strs[strs.length - 1]
      if (str.length === 0) return []
      return comp(str, ['z', 'ab', 'abc', 'abcd', 'abcde'], 3)
    }
  }
}
</script>

<style scoped>

</style>
