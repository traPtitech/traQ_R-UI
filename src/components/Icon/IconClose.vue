<template functional>
  <svg
    :width="props.size"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M17.4549 19.2731L12 13.8183L6.5452 19.2731L4.72693 17.4549L10.1818 12L4.72693 6.5452L6.5452 4.72693L12 10.1818L17.4549 4.72693L19.2731 6.5452L13.8183 12L19.2731 17.4549L17.4549 19.2731Z"
      :fill="props.color"
    />
  </svg>
</template>

<script>
export default {
  name: 'IconClose',
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
