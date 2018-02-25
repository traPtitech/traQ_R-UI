<template lang="pug">
div.message
  div.message-user-icon-wrap
    div.message-user-icon
  div.message-detail-wrap
    p.message-user-name
      | {{$store.state.memberMap[model.userId].name}}
    p.message-date
      | {{dateTime(model.datetime)}}
  div.message-content-wrap
    div.message-content
      | {{model.content}}
  div.message-buttons-wrap
</template>

<script>
export default {
  name: 'MessageElement',
  props: {
    model: Object
  },
  methods: {
    dateTime: function (datetime) {
      const d = new Date(datetime)
      return d.getHours().toString().padStart(2, '0') + ':' + d.getMinutes().toString().padStart(2, '0') + ':' + d.getSeconds().toString().padStart(2, '0')
    }
  }
}
</script>

<style lang="sass">
.message
  display: grid
  grid-template-areas: "user-icon detail""... content""... buttons"
  grid-template-rows: 40px 1fr 30px
  grid-template-columns: 40px 1fr
  border-bottom: solid 1px rgba(0, 0, 0, 0.1)
  margin: 10px 0
  padding: 5px 10px
.message-user-icon-wrap
  grid-area: user-icon
.message-user-icon
  width: 40px
  height: 40px
  background-color: gray
  border-radius: 100%
.message-detail-wrap
  grid-area: detail
  display: flex
  justify-content: space-between
.message-user-name
  margin: 0 0 0 10px
  font-weight: bold
.message-date
  font-size: 0.7em
.message-content-wrap
  grid-area: content
  margin: 0 0 0 10px
  text-align: left
  font-size: 0.9em
.message-buttons-wrap
  grid-area: buttons
</style>
