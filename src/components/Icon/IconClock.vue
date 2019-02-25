<template functional>
  <svg :width="props.size" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path fill-rule="evenodd" clip-rule="evenodd" d="M12 21.087C17.0186 21.087 21.087 17.0186 21.087 12C21.087 6.98141 17.0186 2.91304 12 2.91304C6.98141 2.91304 2.91304 6.98141 2.91304 12C2.91304 17.0186 6.98141 21.087 12 21.087ZM23 12C23 18.0751 18.0751 23 12 23C5.92487 23 1 18.0751 1 12C1 5.92487 5.92487 1 12 1C18.0751 1 23 5.92487 23 12Z" :fill="props.color"/>
    <path fill-rule="evenodd" clip-rule="evenodd" d="M11.0435 3.86963V12.9566H12.9565V12.9565H17.5478V11.0435H12.9565V3.86963H11.0435Z" :fill="props.color"/>
  </svg>
</template>

<script>
export default {
  name: 'IconClock',
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
