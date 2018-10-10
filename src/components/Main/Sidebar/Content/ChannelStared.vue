<template lang="pug">
  div.stared-channels
    ChannelElement(v-for="channel in $store.getters.getStaredChannels" :key="'star' + channel.channelId" :model="channel")
</template>

<script>
export default {
}
</script>

<style lang="sass">
</style>

