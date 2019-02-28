<template functional>
  <svg :width="props.size" :height="props.size" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4 12.9429L15.6364 1L12 9.17143L20 11.0571L7.63636 23L10.5455 14.2L4 12.9429Z" :fill="props.color"/>
  </svg>
</template>

<script>
export default {
  name: 'IconLightning',
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
