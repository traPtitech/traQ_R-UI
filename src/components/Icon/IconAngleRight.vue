<template functional>
  <svg
    :width="props.size"
    :height="props.size"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M8 16.59L12.3266 12L8 7.41L9.33198 6L15 12L9.33198 18L8 16.59Z"
      :fill="props.color"
    />
  </svg>
</template>

<script>
export default {
  name: 'IconAngleRight',
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
