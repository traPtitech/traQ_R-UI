<template lang="pug">
  .attached-files-dummy-container
    .attached-file-wrap(v-for="n in count")
      .attached-file-dummy-content
      .attached-file-dummy-info
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
.attached-files-dummy-container
  margin-top: 12px
  margin-left: 10px

.attached-file-dummy-content
  opacity: 0.6
  width: 250px
  height: 150px
  border:
    radius: 6px
  background: linear-gradient(to right, #eeeeee, #b6b6b6, #eeeeee)
    size: 400% 100%
  animation: dummy-gradient 5s ease infinite

.attached-file-dummy-info
  opacity: 0.6
  margin-top: 6px
  width: 300px
  height: 54px
  border:
    radius: 6px
  background: linear-gradient(to right, #eeeeee, #b6b6b6, #eeeeee)
    size: 400% 100%
  animation: dummy-gradient 5s ease infinite

@keyframes dummy-gradient
	0%
		background-position: 0% 50%
	50%
		background-position: 100% 50%
	100%
		background-position: 0% 50%
</style>
