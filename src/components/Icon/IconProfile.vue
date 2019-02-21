<template functional>
  <svg :width="props.size" :height="props.size" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path fill-rule="evenodd" clip-rule="evenodd" d="M12 9C13.6569 9 15 7.65685 15 6C15 4.34315 13.6569 3 12 3C10.3431 3 9 4.34315 9 6C9 7.65685 10.3431 9 12 9ZM12 11C14.7614 11 17 8.76142 17 6C17 3.23858 14.7614 1 12 1C9.23858 1 7 3.23858 7 6C7 8.76142 9.23858 11 12 11Z" :fill="props.color"/>
    <path fill-rule="evenodd" clip-rule="evenodd" d="M15 14H9C7.89543 14 7 14.8954 7 16V21H17V16C17 14.8954 16.1046 14 15 14ZM9 12C6.79086 12 5 13.7909 5 16V23H19V16C19 13.7909 17.2091 12 15 12H9Z" :fill="props.color"/>
  </svg>
</template>

<script>
export default {
  name: 'IconProfile',
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
