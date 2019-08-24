<template functional>
  <svg
    :width="props.size"
    :height="props.size"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12.1667 14.5C13.8267 14.5 15.1567 13.16 15.1567 11.5L15.1667 5.5C15.1667 3.84 13.8267 2.5 12.1667 2.5C10.5067 2.5 9.16669 3.84 9.16669 5.5V11.5C9.16669 13.16 10.5067 14.5 12.1667 14.5ZM17.4667 11.5C17.4667 14.5 14.9267 16.6 12.1667 16.6C9.40669 16.6 6.86669 14.5 6.86669 11.5H5.16669C5.16669 14.91 7.88669 17.73 11.1667 18.22V21.5H13.1667V18.22C16.4467 17.74 19.1667 14.92 19.1667 11.5H17.4667Z"
      :fill="props.color"
    />
  </svg>
</template>

<script>
export default {
  name: 'IconMic',
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
