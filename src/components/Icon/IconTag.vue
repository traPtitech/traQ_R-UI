<template functional>
  <svg
    :width="props.size"
    :height="props.size"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M10.7556 0L22 11.2444L11.2444 22L0 10.7556V0H10.7556ZM4.27778 6.11111C5.2903 6.11111 6.11111 5.2903 6.11111 4.27778C6.11111 3.26526 5.2903 2.44444 4.27778 2.44444C3.26526 2.44444 2.44444 3.26526 2.44444 4.27778C2.44444 5.2903 3.26526 6.11111 4.27778 6.11111Z"
      :fill="props.color"
    />
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
