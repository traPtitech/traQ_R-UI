<template functional>
  <svg
    :width="props.size"
    :height="props.size"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect
      x="0.949158"
      y="3.56738"
      width="22.1017"
      height="14.2082"
      rx="1"
      :fill="props.color"
    />
    <path
      d="M8.84262 22.5117V17.7756H13.5787L8.84262 22.5117Z"
      :fill="props.color"
    />
  </svg>
</template>

<script>
export default {
  name: 'IconSpeechBalloon',
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
