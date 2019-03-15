<template functional>
  <svg
    :width="props.size"
    :height="props.size"
    version="1.1"
    id="emoji"
    xmlns="http://www.w3.org/2000/svg"
    xmlns:xlink="http://www.w3.org/1999/xlink"
    x="0px"
    y="0px"
    viewBox="0 0 72 72"
    enable-background="new 0 0 72 72"
    xml:space="preserve"
  >
    <g id="_xD83D__xDE0A_">
      <circle
        fill="none"
        :stroke="props.color"
        stroke-miterlimit="10"
        cx="35.2"
        cy="36.6"
        r="23"
      />
      <circle
        fill="none"
        :stroke="props.color"
        stroke-width="4"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-miterlimit="10"
        cx="35.2"
        cy="36.6"
        r="23"
      />
      <path
        fill="none"
        :stroke="props.color"
        stroke-width="4"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-miterlimit="10"
        d="
		M45,45.4c-5.9,4.7-14.1,4.7-19.6,0"
      />
      <path
        :fill="props.color"
        :stroke="props.color"
        stroke-width="2"
        d="M31.1,34.8c-0.4,0-0.7-0.2-0.9-0.6c0,0-1.2-2.3-3.4-2.3c-2.2,0-3.4,2.3-3.4,2.3c-0.2,0.5-0.8,0.7-1.3,0.4
		c-0.5-0.2-0.7-0.8-0.4-1.3c0.1-0.1,1.8-3.4,5.2-3.4s5.1,3.3,5.2,3.4c0.2,0.5,0,1.1-0.4,1.3C31.4,34.7,31.2,34.8,31.1,34.8z"
      />
      <path
        :fill="props.color"
        :stroke="props.color"
        stroke-width="2"
        d="M48.3,34.8c-0.4,0-0.7-0.2-0.9-0.6c0,0-1.2-2.3-3.4-2.3c-2.2,0-3.4,2.3-3.4,2.3c-0.2,0.5-0.8,0.7-1.3,0.4
		c-0.5-0.2-0.7-0.8-0.4-1.3c0.1-0.1,1.8-3.4,5.2-3.4c3.5,0,5.1,3.3,5.2,3.4c0.2,0.5,0,1.1-0.4,1.3C48.6,34.7,48.5,34.8,48.3,34.8z"
      />
    </g>
  </svg>
</template>

<script>
export default {
  name: 'IconSmile',
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
