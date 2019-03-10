<template functional>
  <svg
    :width="props.size"
    :height="props.size"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M9.25 1C7.248 1 5.367 1.55 3.75 2.485C7.039 4.388 9.25 7.93 9.25 12C9.25 16.07 7.039 19.612 3.75 21.515C5.367 22.45 7.248 23 9.25 23C15.322 23 20.25 18.072 20.25 12C20.25 5.928 15.322 1 9.25 1Z"
      :fill="props.color"
    />
  </svg>
</template>

<script>
export default {
  name: 'IconCrescentFill',
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
