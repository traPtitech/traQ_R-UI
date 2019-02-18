<template functional>
  <svg :width="props.size" :height="props.size" viewBox="0 0 7 12" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M7 1.41L2.67341 6L7 10.59L5.66802 12L3.22355e-07 6L5.66802 -5.82229e-08L7 1.41Z" :fill="props.color"/>
  </svg>
</template>


<script>
export default {
  name: 'IconBack',
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
