<template functional>
  <svg
    :width="props.size"
    :height="props.size"
    viewBox="0 0 22 22"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M0 16.8203V21.4996H4.8058L17.4527 8.8528L12.6469 4.17346L0 16.8203ZM3.66759 18.9703H2.52937V17.8321L12.6469 7.71458L13.7851 8.8528L3.66759 18.9703Z"
      :fill="props.color"
    />
    <path
      d="M21.1203 3.28818L18.2116 0.379406C17.7057 -0.126468 16.9469 -0.126468 16.441 0.379406L13.9116 2.90878L18.7174 7.58811L21.2468 5.05874C21.6262 4.67933 21.6262 3.79405 21.1203 3.28818Z"
      :fill="props.color"
    />
  </svg>
</template>

<script>
export default {
  name: 'IconPen',
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
