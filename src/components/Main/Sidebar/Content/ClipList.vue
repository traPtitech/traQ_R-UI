<template lang="pug">
div
  p(style="text-align:center")
    | Humming Soon
  virtual-scroller.scroller(:items="list" content-tag="div")
    template(slot-scope="props")
      div
        | {{props.itemIndex}} : {{props.item}}
</template>

<script>
export default {
  name: 'LinkList',
  data () {
    return {
      list: ['hoge','foo','bar']
    }
  }
}
</script>

<style lang="sass">
</style>
