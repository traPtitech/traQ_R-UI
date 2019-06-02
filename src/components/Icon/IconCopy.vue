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
      d="M13.6667 9.33333H4.33333L4.33333 18.6667H13.6667V9.33333ZM4.33333 8C3.59695 8 3 8.59695 3 9.33333V18.6667C3 19.403 3.59695 20 4.33333 20H13.6667C14.403 20 15 19.403 15 18.6667V9.33333C15 8.59695 14.403 8 13.6667 8H4.33333Z"
      :fill="props.color"
    ></path>
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M16.3555 14.9L18.6778 14.9C19.408 14.9 20 14.308 20 13.5778L20 4.32225C20 3.592 19.408 3.00002 18.6778 3.00002L9.4222 3.00002C8.69195 3.00002 8.09998 3.592 8.09998 4.32225L8.09998 6.64439L9.4222 6.64439L9.4222 4.32225L18.6778 4.32225L18.6778 13.5778L16.3555 13.5778L16.3555 14.9Z"
      :fill="props.color"
    ></path>
  </svg>
</template>

<script>
export default {
  name: 'IconCopy',
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
