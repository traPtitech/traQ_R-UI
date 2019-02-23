<template functional>
  <svg :width="props.size" :height="props.size" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M18.2806 19.647V12.5882L20.6336 10.2353V21.9999H1.81006V4.35291H14.7512L12.3983 6.70584H4.163V19.647H18.2806Z" :fill="props.color"/>
    <path d="M6.51587 14.8858V18.4706H10.1975L19.8861 8.78204L16.2044 5.19727L6.51587 14.8858ZM9.32555 16.5329H8.45358V15.6609L16.2044 7.91007L17.0764 8.78204L9.32555 16.5329Z" :fill="props.color"/>
    <path d="M22.6958 4.51903L20.4675 2.29066C20.0799 1.90311 19.4986 1.90311 19.1111 2.29066L17.1733 4.22837L20.855 7.81314L22.7927 5.87543C23.0834 5.58477 23.0834 4.90657 22.6958 4.51903Z" :fill="props.color"/>
  </svg>

</template>

<script>
export default {
  name: 'IconEdit',
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
