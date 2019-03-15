<template functional>
  <svg
    :width="props.size"
    :height="props.size"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12.0894 10.6752C12.4799 10.2847 13.1131 10.2847 13.5036 10.6752L22.7782 19.9497C23.1687 20.3403 23.1687 20.9734 22.7782 21.364L21.364 22.7782C20.9734 23.1687 20.3403 23.1687 19.9497 22.7782L10.6752 13.5036C10.2847 13.1131 10.2847 12.4799 10.6752 12.0894L12.0894 10.6752Z"
      :fill="props.color"
    />
    <path
      d="M1.71155 4.53998C1.25666 5.42776 1 6.43391 1 7.5C1 11.0899 3.91015 14 7.5 14C11.0899 14 14 11.0899 14 7.5C14 3.91015 11.0899 1 7.5 1C6.43391 1 5.42776 1.25666 4.53998 1.71155L9.6066 6.77817L9 9L6.77818 9.6066L1.71155 4.53998Z"
      :fill="props.color"
    />
  </svg>
</template>

<script>
export default {
  name: 'IconWrench',
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
