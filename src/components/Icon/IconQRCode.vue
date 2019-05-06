<template functional>
  <svg
    :width="props.size"
    :height="props.size"
    viewBox="0 0 22 22"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M2 0.5H9.125V9.125H0.5V2C0.5 1.17157 1.17157 0.5 2 0.5Z"
      :stroke="props.color"
    />
    <path
      d="M21.5 2L21.5 9.125L12.875 9.125L12.875 0.5L20 0.5C20.8284 0.5 21.5 1.17157 21.5 2Z"
      :stroke="props.color"
    />
    <path
      d="M0.5 12.875H9.125V21.5H2C1.17157 21.5 0.5 20.8284 0.5 20V12.875Z"
      :stroke="props.color"
    />
    <rect x="2.75" y="2.75" width="4.125" height="4.125" :fill="props.color" />
    <rect
      x="2.75"
      y="15.125"
      width="4.125"
      height="4.125"
      :fill="props.color"
    />
    <rect x="15" y="15" width="4.125" height="4.125" :fill="props.color" />
    <rect
      x="15.125"
      y="2.75"
      width="4.125"
      height="4.125"
      :fill="props.color"
    />
    <path
      d="M14.5 21C14.2239 21 14 21.2239 14 21.5C14 21.7761 14.2239 22 14.5 22V21ZM21.5 21.5V22H22V21.5H21.5ZM22 14.5C22 14.2239 21.7761 14 21.5 14C21.2239 14 21 14.2239 21 14.5H22ZM14.5 22H21.5V21H14.5V22ZM22 21.5V14.5H21V21.5H22Z"
      :fill="props.color"
    />
    <path d="M13.5 17V13.5H17" :stroke="props.color" />
  </svg>
</template>

<script>
export default {
  name: 'IconQRCode',
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
