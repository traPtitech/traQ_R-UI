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
      d="M9.51629 15.0643L19.9484 4.63208L22 6.6837L9.5163 19.1676L2.00012 11.6514L4.05175 9.59981L9.51629 15.0643Z"
      :fill="props.color"
    />
  </svg>
</template>

<script>
export default {
  name: 'IconCheck',
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
