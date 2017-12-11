<template lang="pug">
div.input-ui
  div.input-area Input here
</template>

<script>
export default {
}
</script>

<style lang="sass">
.input-ui
  position: relative
  height: 100%
.input-area
  text-align: center
  box-sizing: border-box
  color: white
  width: 90%
  height: 30px
  position: absolute
  bottom: 20px
  right: 0
  left: 0
  margin: auto
  // border: 2px solid white
  background: linear-gradient(left,#00E1FF,#D897FF)
  transition: all .5s ease
  opacity: 0.8
  &:hover
    width: 100%
    bottom: 0px
    height: 60px
    border: solid 4px black
</style>
