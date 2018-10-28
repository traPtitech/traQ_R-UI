<template lang="pug">
.user-modal-online-status(:data-is-detailed="detailed")
  .user-modal-online-indicator(:data-is-online="data.isOnline")
  template(v-if="detailed")
    .user-modal-online-status-abstract(v-if="data.isOnline") Online
    .user-modal-online-status-abstract(v-else) Offline
    .user-modal-online-status-detail Last: {{lastOnline}}
</template>

<script>
import { mapState } from 'vuex'

function paddingNumber (n, k) {
  let ret = `${n}`
  for (let i = 0; i < k; i++) ret = '0' + ret
  return ret.slice(-k)
}
function dateParse (date) {
  return `${date.getFullYear()}/${paddingNumber(date.getMonth(), 2)}/${paddingNumber(date.getDate(), 2)} ${paddingNumber(date.getHours(), 2)}:${paddingNumber(date.getMinutes(), 2)}`
}
export default {
  props: {
    detailed: false
  },
  computed: {
    ...mapState('modal', ['data']),
    lastOnline () {
      return dateParse(new Date(this.data.lastOnline))
    }
  }
}
</script>

<style lang="sass">
.user-modal-online-status
  display: grid
  grid-template-columns: 0.6rem
  align-items: center
  &[data-is-detailed]
    margin: 0.6rem 0px 0px 0.2rem
    grid-template-columns: 1.5rem 1fr

.user-modal-online-indicator
  width: 0.6rem
  height: 0.6rem
  border-radius: 50%
  &[data-is-online="true"]
    background-color: #27ae60
  &:not([data-is-online="true"])
    border: 1px solid lightgray

.user-modal-online-status-abstract
  display: inline-block
  margin-right: 0.5rem

.user-modal-online-status-detail
  display: inline-block
  font-size: 0.8rem
  color: rgba(255, 255, 255, 0.7)
  grid-column: 2/3
</style>
