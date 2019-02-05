<template functional>
  <svg :width="props.size" :height="props.size" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M1 15L15 1M1 1L15 15" :stroke="props.color" stroke-width="2"/>
  </svg>
</template>

<script>
export default {
  name: 'IconClose',
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
