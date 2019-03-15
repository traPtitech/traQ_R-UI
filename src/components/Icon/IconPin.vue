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
      d="M18 3H6V6H8V11C8 11 6 11 6 16H11V21H13V16H18C18 11 16 11 16 11V6H18V3Z"
      :fill="props.color"
    />
  </svg>
</template>

<script>
export default {
  name: 'IconPin',
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
