<template functional>
  <svg :width="props.size" :height="props.size" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path fill-rule="evenodd" clip-rule="evenodd" d="M7 10C9.76142 10 12 7.76142 12 5C12 2.23858 9.76142 0 7 0C4.23858 0 2 2.23858 2 5C2 7.76142 4.23858 10 7 10Z" :fill="props.color"/>
    <path fill-rule="evenodd" clip-rule="evenodd" d="M4 11C1.79086 11 0 12.7909 0 15V22H14V15C14 12.7909 12.2091 11 10 11H4Z" :fill="props.color"/>
  </svg>
</template>

<script>
export default {
  name: 'IconProfileFill',
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
