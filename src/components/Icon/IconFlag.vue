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
    <g id="_xD83C__xDFF3__xFE0F_">
      <path
        fill="none"
        :stroke="props.color"
        stroke-width="4"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-miterlimit="10"
        d="
		M23.1,17.5c2.9-1.8,8.4-4.2,14.4-1.5c3.7,1.7,5.6,4.7,15,4.1c0.8,0,1.5,0.6,1.5,1.4c0,3.3,0,11.1,0,15.1c0,0.6-0.4,1.1-1,1.4
		c-1.9,1-7.3,0.9-15.5-3c-3.4-1.6-8.6-2.6-14.5,1.4"
      />

      <line
        fill="none"
        :stroke="props.color"
        stroke-width="4"
        stroke-linecap="round"
        stroke-miterlimit="10"
        x1="19.3"
        y1="12.9"
        x2="19.3"
        y2="59.8"
      />
    </g>
  </svg>
</template>

<script>
export default {
  name: 'IconFlag',
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
