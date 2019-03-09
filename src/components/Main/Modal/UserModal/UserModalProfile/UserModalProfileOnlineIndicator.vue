<template lang="pug">
.user-modal-online-status(:data-is-detailed="detailed")
  .user-modal-online-indicator(:data-is-online="data.isOnline")
  .user-modal-online-status-detail(v-if="detailed")
    .user-modal-online-status-onoff(v-if="data.isOnline") Online
    .user-modal-online-status-onoff(v-else) Offline
    .user-modal-online-status-last Last: {{lastOnline}}
</template>

<script>
import { mapState } from 'vuex'

function paddingNumber(n, k) {
  let ret = `${n}`
  for (let i = 0; i < k; i++) ret = '0' + ret
  return ret.slice(-k)
}
function dateParse(date) {
  return `${date.getFullYear()}/${paddingNumber(
    date.getMonth() + 1,
    2
  )}/${paddingNumber(date.getDate(), 2)} ${paddingNumber(
    date.getHours(),
    2
  )}:${paddingNumber(date.getMinutes(), 2)}`
}
export default {
  props: {
    detailed: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  computed: {
    ...mapState('modal', ['data']),
    lastOnline() {
      return dateParse(new Date(this.data.lastOnline))
    }
  }
}
</script>

<style lang="sass">
.user-modal-online-status
  display: flex
  align-items: flex-start

.user-modal-online-indicator
  width: 10px
  height: 10px
  border-radius: 50%
  transform: translateY(0.25rem)
  &[data-is-online="true"]
    background-color: #18FCFC
  &:not([data-is-online="true"])
    border: 1px solid lightgray

.user-modal-online-status-detail
  margin-left: 0.5rem

.user-modal-online-status-last
  font-size: 0.8rem
  color: rgba(255, 255, 255, 0.7)
  grid-column: 2/3
</style>
