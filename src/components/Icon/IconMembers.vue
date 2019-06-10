<template functional>
  <svg
    :width="props.size"
    :height="props.size"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <text
      :fill="props.color"
      x="50%"
      y="50%"
      text-anchor="middle"
      dominant-baseline="central"
    >
      M
    </text>
    <!-- something -->
  </svg>
</template>

<script>
export default {
  name: 'IconMembers',
  props: {
    size: {
      type: String,
      default: '16'
    },
    color: {
      type: String,
      default: 'white'
    }
  }
}
</script>
