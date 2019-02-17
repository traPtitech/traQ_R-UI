<template functional>
  <svg :width="props.size" :height="props.size" :viewBox="`0 0 ${props.size} ${props.size}`" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M19 13H13V19H11V13H5V11H11V5H13V11H19V13Z" :fill="props.color"/>
  </svg>
</template>

<script>
export default {
  name: 'IconPlus',
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
