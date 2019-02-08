<template functional>
  <svg :width="props.size" :height="props.size" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M7.41 8L12 12.58L16.59 8L18 9.41L12 15.41L6 9.41L7.41 8Z" :fill="props.color"/>
  </svg>
</template>

<script>
export default {
  name: 'IconDownDirection',
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
