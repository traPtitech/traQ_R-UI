<template functional>
  <svg
    :width="props.size"
    :height="props.size"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M21 13.2857H13.2857V21H10.7143V13.2857H3V10.7143H10.7143V3H13.2857V10.7143H21V13.2857Z"
      :fill="props.color"
    />
  </svg>
</template>

<script>
export default {
  name: 'IconPlus',
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
