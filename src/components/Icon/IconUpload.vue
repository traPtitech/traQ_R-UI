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
      d="M12 2L19.4702 8.22517L18.0298 9.95367L13.1249 5.86627V18.0894H10.8749V5.86642L5.97025 9.95367L4.52983 8.22517L12 2ZM5.25 18.0895V20.3395H18.75V18.0895H21V22.5895H3V18.0895H5.25Z"
      :fill="props.color"
    />
  </svg>
</template>

<script>
export default {
  name: 'IconUpload',
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
