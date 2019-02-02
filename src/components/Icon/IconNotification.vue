<template functional>
  <svg :width="props.size" :height="props.size" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 21.5C13.1 21.5 14 20.6 14 19.5H10C10 20.6 10.89 21.5 12 21.5ZM18 15.5V10.5C18 7.43 16.36 4.86 13.5 4.18V3.5C13.5 2.67 12.83 2 12 2C11.17 2 10.5 2.67 10.5 3.5V4.18C7.63 4.86 6 7.42 6 10.5V15.5L4 17.5V18.5H20V17.5L18 15.5Z" :fill="props.color"/>
  </svg>
</template>

<script>
export default {
  name: 'IconNotification',
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
