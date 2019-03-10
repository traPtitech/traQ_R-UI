<template functional>
  <svg
    :width="props.size"
    :height="props.size"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M2 4H22C22.5523 4 23 4.44772 23 5V7L12 14.5L1 7V5C1 4.44772 1.44772 4 2 4ZM23 9L12 16.5L1 9V18.5C1 19.0523 1.44772 19.5 2 19.5H22C22.5523 19.5 23 19.0523 23 18.5V9Z"
      :fill="props.color"
    />
  </svg>
</template>

<script>
export default {
  name: 'IconEnverope',
  props: {
    size: {
      // Use no type check to prevent a warning in UserProfileImage
      default: 16
    },
    color: {
      type: String,
      default: 'white'
    }
  }
}
</script>
