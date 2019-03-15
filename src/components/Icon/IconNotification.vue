<template functional>
  <svg
    :width="props.size"
    :height="props.size"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 21.5C13.1 21.5 14 20.6 14 19.5H10C10 20.6 10.9 21.5 12 21.5ZM18 15.5V10.5C18 7.43 16.37 4.86 13.5 4.18V3.5C13.5 2.67 12.83 2 12 2C11.17 2 10.5 2.67 10.5 3.5V4.18C7.64 4.86 6 7.42 6 10.5V15.5L4 17.5V18.5H20V17.5L18 15.5ZM16 16.5H8V10.5C8 8.02 9.51 6 12 6C14.49 6 16 8.02 16 10.5V16.5Z"
      :fill="props.color"
    />
  </svg>
</template>

<script>
export default {
  name: 'IconNotification',
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
