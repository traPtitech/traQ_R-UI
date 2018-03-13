<template lang="pug">
div(@dragenter="style=onDragStyle" @dragend="style=''" @dragleave="style=''" @dragover.stop.prevent="dragover" @drop.stop.prevent="dropFile" :style="style")
  slot
</template>

<script>
export default {
  name: 'FileDroper',
  props: ['onDragStyle'],
  data () {
    return {
      style: ''
    }
  },
  methods: {
    dragover (event) {},
    dropFile (event) {
      if (process.env.NODE_ENV === 'development') {
        console.info('file drop event', event)
      }
      if (event.dataTransfer.files.length > 0) {
        this.$emit('dropFile', event.dataTransfer.files)
      }
    }
  }
}
</script>
