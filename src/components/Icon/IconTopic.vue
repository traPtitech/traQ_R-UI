<template functional>
  <svg :width="props.size" :height="props.size" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path fill-rule="evenodd" clip-rule="evenodd" d="M4.5 5C3.80964 5 3.25 5.55964 3.25 6.25V15C3.25 15.6904 3.80964 16.25 4.5 16.25H9.5V20L13.25 16.25H19.5C20.1904 16.25 20.75 15.6904 20.75 15V6.25C20.75 5.55964 20.1904 5 19.5 5H4.5Z" :fill="props.color"/>
  </svg>
</template>

<script>
export default {
  name: 'IconTopic',
  props: {
    size: {
      type: Number,
      default: 16
    },
    color: {
      type: String,
      default: 'white'
    }
  }
}
</script>
