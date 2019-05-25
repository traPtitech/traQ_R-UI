<template functional>
  <svg
    :width="props.size"
    :height="props.size"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M20.1767 15.38C18.9467 15.38 17.7567 15.18 16.6467 14.82C16.2967 14.7 15.9067 14.79 15.6367 15.06L14.0667 17.03C11.2367 15.68 8.58669 13.13 7.17669 10.2L9.12669 8.54C9.39669 8.26 9.47669 7.87 9.36669 7.52C8.99669 6.41 8.80669 5.22 8.80669 3.99C8.80669 3.45 8.35669 3 7.81669 3H4.35669C3.81669 3 3.16669 3.24 3.16669 3.99C3.16669 13.28 10.8967 21 20.1767 21C20.8867 21 21.1667 20.37 21.1667 19.82V16.37C21.1667 15.83 20.7167 15.38 20.1767 15.38Z"
      :fill="props.color"
    />
  </svg>
</template>

<script>
export default {
  name: 'IconCall',
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
