<template lang="pug">
div.message
  div.m-icon-wrap
    div.m-icon
  div.m-text-wrap
    div.m-text
</template>

<script>
export default {
  name: 'MessageMock'
}
</script>

<style lang="sass">
.message
  display: grid
  grid-template-rows: 60px 1fr
  grid-template-columns: 60px 1fr
  grid-template-areas: "icon text""... text"
  margin: 20px 0
.m-icon-wrap
  grid-area: icon
  margin: 0 0 0 15px
.m-icon
  background-color: #c1c1c1
  width: 40px
  height: 40px
  border-radius: 100%
.m-text-wrap
  grid-area: text
  margin: 0 30px 0 10px
.m-text
  width: 100%
  height: 25px
  background: linear-gradient(270deg, #c1c1c1, #777777, #c1c1c1)
  background-size: 600% 100%
  animation: m-text-gradient 5s ease infinite
@keyframes m-text-gradient
  0%
    background-position: 0% 50%
  50%
    background-position: 100% 50%
  100%
    background-position: 0% 50%
</style>
