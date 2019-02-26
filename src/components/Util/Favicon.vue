<template lang="pug">
</template>

<script>
export default {
  name: 'favicon',
  data () {
    return {
      canvas: null,
      img: null,
      ctx: null
    }
  },
  created () {
    this.canvas = document.createElement('canvas')
    this.canvas.width = 32
    this.canvas.height = 32

    this.img = new Image()
    this.img.src = '/static/favicon-32x32.png'

    this.ctx = this.canvas.getContext('2d')

    this.updateFavicon()
  },
  methods: {
    updateFavicon () {
      this.ctx.drawImage(this.img, 0, 0, 32, 32)
      if (Object.keys(this.$store.state.unreadMessages).length > 0) {
        this.ctx.font = "bold 10px 'ヒラギノ角ゴ ProN W3'"
        this.ctx.fillStyle = '#F2994A'
        this.ctx.beginPath()
        this.ctx.arc(6, 6, 10, 0, Math.PI * 2, true)
        this.ctx.fill()
      }

      const faviconImage = this.canvas.toDataURL('image/png')
      document.getElementById('favicon').href = faviconImage
    }
  },
  watch: {
    '$store.state.unreadMessages': function () {
      this.updateFavicon()
    }
  }
}
</script>

