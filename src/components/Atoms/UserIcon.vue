<template lang="pug">
  .user-icon(:style="iconStyle")
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { User } from 'traq-api'
@Component
export default class UserIcon extends Vue {
  @Prop({ type: Object, required: true })
  private user!: User

  @Prop({ type: Number, default: 40 })
  private size!: number

  get iconStyle() {
    return {
      backgroundImage: `url(${this.userIconSrc})`,
      width: `${this.size}px`,
      height: `${this.size}px`
    }
  }

  get userIconSrc() {
    return this.$store.getters.fileUrl(this.user.iconFileId)
  }
}
</script>

<style lang="sass" scoped>
.user-icon
  border-radius: 100vw
  background:
    repeat: no-repeat
    position: center
    size: cover
</style>
