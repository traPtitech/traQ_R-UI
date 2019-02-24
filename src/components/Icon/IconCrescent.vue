<template functional>
  <svg :width="props.size" :height="props.size" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M9.25 3.2C14.101 3.2 18.05 7.149 18.05 12C18.05 16.851 14.101 20.8 9.25 20.8C8.876 20.8 8.502 20.778 8.139 20.723C10.24 18.347 11.45 15.245 11.45 12C11.45 8.755 10.24 5.653 8.139 3.277C8.502 3.222 8.876 3.2 9.25 3.2ZM9.25 1C7.248 1 5.367 1.55 3.75 2.485C7.039 4.388 9.25 7.93 9.25 12C9.25 16.07 7.039 19.612 3.75 21.515C5.367 22.45 7.248 23 9.25 23C15.322 23 20.25 18.072 20.25 12C20.25 5.928 15.322 1 9.25 1Z" :fill="props.color"/>
  </svg>
</template>

<script>
export default {
  name: 'IconCrescent',
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
