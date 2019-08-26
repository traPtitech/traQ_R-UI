<template lang="pug">
  .attached-messages-dummy-container
    .attached-message-dummy-wrap(v-for="n in count")
      .attached-message-dummy-detail-wrap
        .attached-message-dummy-icon
        .attached-message-dummy-user-name
      .attached-message-dummy-content
      .attached-message-dummy-content2
      .attached-message-dummy-from
</template>

<script>
export default {
  props: {
    count: {
      type: Number,
      required: true
    }
  }
}
</script>

<style lang="sass">
.attached-messages-dummy-container
  margin-top: 10px
  margin-left: 10px

.attached-message-dummy-wrap
  padding: 5px 10px
  border:
    left:
      width: 4px
      style: solid
      color: #b6b6b6

.attached-message-dummy-detail-wrap
  display: flex
  align-items: center

.attached-message-dummy-icon
  width: 20px
  height: 20px
  border-radius: 100%
  background: linear-gradient(to right, #eeeeee, #b6b6b6, #eeeeee)
    size: 400% 100%
  animation: dummy-gradient 5s ease infinite

.attached-message-dummy-user-name
  margin-left: 6px
  width: 100px
  height: 12px
  border:
    radius: 9999vw
  background: linear-gradient(to right, #eeeeee, #b6b6b6, #eeeeee)
    size: 400% 100%
  animation: dummy-gradient 5s ease infinite

.attached-message-dummy-content
  margin:
    top: 12px
    bottom: 8px
  width: 300px
  height: 12px
  border:
    radius: 9999vw
  background: linear-gradient(to right, #eeeeee, #b6b6b6, #eeeeee)
    size: 400% 100%
  animation: dummy-gradient 5s ease infinite

.attached-message-dummy-content2
  margin:
    top: 12px
    bottom: 32px
  width: 180px
  height: 12px
  border:
    radius: 9999vw
  background: linear-gradient(to right, #eeeeee, #b6b6b6, #eeeeee)
    size: 400% 100%
  animation: dummy-gradient 5s ease infinite

.attached-message-dummy-from
  margin-top: 12px
  width: 80px
  height: 6px
  border:
    radius: 9999vw
  background: linear-gradient(to right, #eeeeee, #b6b6b6, #eeeeee)
    size: 400% 100%
  animation: dummy-gradient 5s ease infinite
</style>
