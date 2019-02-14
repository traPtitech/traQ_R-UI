<template functional>
  <svg :width="props.size" :height="props.size" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M14 8H8V14H6V8H0V6H6V0H8V6H14V8Z" :fill="props.color"/>
  </svg>
</template>

<script>
export default {
  name: 'IconAdd',
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
