<template lang="pug">
div.member-choice(@click="onClick")
  img.member-choice-icon(:src="`${$store.state.baseURL}/api/1.0/users/${model.userId}/icon`")
  div.member-choice-name
    | {{model.displayName}}
  div.member-choice-id
    | @{{model.name}}
</template>

<script>
import client from '@/bin/client'
export default {
  name: 'Memberchoice',
  props: {
    model: Object,
    value: Boolean
  },
  methods: {
    userIconSrc () {
      return client.getUserIconUrl(this.model.userId)
    },
    onClick () {
      this.$emit('input', this.model.userId)
    }
  },
  computed: {
  }
}
</script>

<style lang="sass">
$size: 2rem

.member-choice
  display: grid
  height: $size
  grid-template-rows: 2fr 1fr
  grid-template-columns: $size 1fr
  grid-template-areas: "icon name""icon id"
  padding: 0.5rem
  cursor: pointer
  text-align: left
  transition: all 0.2s ease

  &:hover
    background-color: lighten(#3a4891, 20%)
    color: white

.member-choice-icon
  grid-area: icon
  width: $size
  height: $size
  background-color: gray
  border-radius: 100%

.member-choice-name
  grid-area: name
  padding-left: 1rem
  white-space: nowrap

.member-choice-id
  grid-area: id
  font-size: 0.5rem
  padding-left: 1rem
  display: inline-block
</style>
