<template lang="pug">
div.information
  OnlineUsers
  Notifications.channel-button
  Pinned.channel-button
  Topic.channel-button
</template>

<script>
const asyncLoadComponents = component => {
  return () => {
    return component
      .then(data => {
        if (process.env.NODE_ENV) {
          console.log('async load component:', data.default.name)
        }
        return data
      })
  }
}
export default {
  name: 'ChannelInformation',
  components: {
    'OnlineUsers': asyncLoadComponents(import('@/components/Main/MessageView/ChannelInformation/OnlineUsers'
)),
    'Topic': asyncLoadComponents(import('@/components/Main/MessageView/ChannelInformation/Topic'
    )),
    'Pinned': asyncLoadComponents(import('@/components/Main/MessageView/ChannelInformation/Pinned')),
    'Notifications': asyncLoadComponents(import('@/components/Main/MessageView/ChannelInformation/Notifications'))
  }
}
</script>

<style lang="sass">
.information
  grid-area: information
  display: flex
  flex-direction: column
  background-color: #c2c2c2
  border-left: 1px solid #B0B0B0
.channel-button
  margin: 5px auto
  cursor: pointer
</style>
