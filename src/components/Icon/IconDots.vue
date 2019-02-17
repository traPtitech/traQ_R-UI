<template functional>
  <svg :width="props.size" :height="props.size" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path fill-rule="evenodd" clip-rule="evenodd" d="M12.9 6.8C11.8506 6.8 11 5.94934 11 4.9C11 3.85066 11.8506 3 12.9 3C13.9493 3 14.8 3.85066 14.8 4.9C14.8 5.94934 13.9493 6.8 12.9 6.8ZM12.9 14.8C11.8506 14.8 11 13.9493 11 12.9C11 11.8507 11.8506 11 12.9 11C13.9493 11 14.8 11.8507 14.8 12.9C14.8 13.9493 13.9493 14.8 12.9 14.8ZM11 20.9C11 21.9493 11.8506 22.8 12.9 22.8C13.9493 22.8 14.8 21.9493 14.8 20.9C14.8 19.8507 13.9493 19 12.9 19C11.8506 19 11 19.8507 11 20.9Z" :fill="props.color"/>
  </svg>
</template>

<script>
export default {
  name: 'IconDots',
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
