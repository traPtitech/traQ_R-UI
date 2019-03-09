<template functional>
  <svg
    :width="props.size"
    :height="props.size"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      :stroke="props.color"
      stroke-width="0.5"
      d="M13.6457 13.4729H10.2596L9.49909 15.5822H8.39999L11.4863 7.5H12.4189L15.5108 15.5822H14.4173L13.6457 13.4729ZM10.5815 12.5958H13.3293L11.9526 8.81558L10.5815 12.5958Z"
      :fill="props.color"
    />
    <circle cx="12" cy="12" r="8.5" :stroke="props.color" stroke-width="1.5" />
  </svg>
</template>

<script>
export default {
  name: 'IconRegional',
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
