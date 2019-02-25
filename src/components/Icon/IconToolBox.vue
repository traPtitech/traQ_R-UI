<template functional>
  <svg :width="props.size" :height="props.size" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path fill-rule="evenodd" clip-rule="evenodd" d="M16 3C16 2.44772 15.5523 2 15 2H9C8.44772 2 8 2.44772 8 3V7H2C1.44772 7 1 7.44772 1 8V21C1 21.5523 1.44772 22 2 22H22C22.5523 22 23 21.5523 23 21V8C23 7.44772 22.5523 7 22 7H16V3ZM14 7H10V4L14 4V7ZM3 9V12V13V14L11 14V16H13V14H21V13V12V9H19V12L5 12V9H3Z" :fill="props.color"/>
  </svg>
</template>

<script>
export default {
  name: 'IconToolBox',
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
