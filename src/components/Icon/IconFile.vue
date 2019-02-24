<template functional>
  <svg :width="props.size" :height="props.size" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M13.3333 2V7.3125C13.3333 7.82812 13.7833 8.25 14.3333 8.25H20V21.0625C20 21.582 19.5542 22 19 22H5C4.44583 22 4 21.582 4 21.0625V2.9375C4 2.41797 4.44583 2 5 2H13.3333Z" :fill="props.color"/>
    <path d="M20 7V6.76172C20 6.51562 19.8958 6.27734 19.7083 6.10156L15.6292 2.27344C15.4417 2.09766 15.1875 2 14.9208 2H14.6667V7H20Z" :fill="props.color"/>
  </svg>
</template>

<script>
export default {
  name: 'IconFile',
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
