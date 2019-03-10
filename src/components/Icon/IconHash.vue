<template functional>
  <svg
    :width="props.size"
    :height="props.size"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M3 17.5753V14.9836H6.56949L7.75932 8.4137H4.52542V5.82192H8.24746L9.10169 1H12.1525L11.2983 5.82192H14.9593L15.8136 1H18.8644L18.0102 5.82192H21V8.4137H17.522L16.3322 14.9836H19.4746V17.5753H15.8746L14.8983 23H11.8475L12.8237 17.5753H9.16271L8.18644 23H5.13559L6.11186 17.5753H3ZM14.4712 8.4137H10.8102L9.62034 14.9836H13.2814L14.4712 8.4137Z"
      :fill="props.color"
    />
  </svg>
</template>

<script>
export default {
  name: 'IconHash',
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
