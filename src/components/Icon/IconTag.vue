<template functional>
  <svg :width="props.size" :height="props.size" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path fill-rule="evenodd" clip-rule="evenodd" d="M8.8 0L18 9.2L9.2 18L0 8.8V0H8.8ZM3.5 5C4.32843 5 5 4.32843 5 3.5C5 2.67157 4.32843 2 3.5 2C2.67157 2 2 2.67157 2 3.5C2 4.32843 2.67157 5 3.5 5Z" :fill="props.color"/>
  </svg>
</template>

<script>
export default {
  name: 'IconTag',
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
