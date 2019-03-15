<template functional>
  <svg
    :width="props.size"
    :height="props.size"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M17.2791 4H1L6.72093 12L1 20H17.2791L23 12L17.2791 4Z"
      :fill="props.color"
    />
  </svg>
</template>

<script>
export default {
  name: 'IconSend',
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
