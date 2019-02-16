<template functional>
  <svg :width="props.size" :height="props.size" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path fill-rule="evenodd" clip-rule="evenodd" d="M6.8 11.9C6.8 12.9493 5.94934 13.8 4.9 13.8C3.85066 13.8 3 12.9493 3 11.9C3 10.8507 3.85066 10 4.9 10C5.94934 10 6.8 10.8507 6.8 11.9ZM14.8 11.9C14.8 12.9493 13.9493 13.8 12.9 13.8C11.8507 13.8 11 12.9493 11 11.9C11 10.8507 11.8507 10 12.9 10C13.9493 10 14.8 10.8507 14.8 11.9ZM20.9 13.8C21.9493 13.8 22.8 12.9493 22.8 11.9C22.8 10.8507 21.9493 10 20.9 10C19.8507 10 19 10.8507 19 11.9C19 12.9493 19.8507 13.8 20.9 13.8Z" :fill="props.color"/>
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
