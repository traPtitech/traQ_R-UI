import { GetterTree } from 'vuex'
import { S, TempRS } from './types'

const getters: GetterTree<S, TempRS> = {
  currentChannelCallingMemberIds({ userStateMap }, _, { me, currentChannel }) {
    return Object.values(userStateMap)
      .filter(
        user =>
          user.userId !== me.userId &&
          user.channelId === currentChannel.channelId &&
          user.state &&
          user.state.includes('calling')
      )
      .map(user => user.userId)
  },
  remoteAudioStreams({ remoteAudioStreamMap }) {
    return Object.values(remoteAudioStreamMap)
  },
  remoteVideoStreams({ remoteVideoStreamMap }) {
    return Object.values(remoteVideoStreamMap)
  },
  isCallingOnCurrentChannel({ activeMediaChannelId }, _, { currentChannel }) {
    return activeMediaChannelId === currentChannel.channelId
  },
  stateArray({ rtcState }) {
    return [...rtcState]
  },
  isActive({ client }) {
    return !!client
  },
  isCalling({ rtcState }) {
    return rtcState.includes('calling')
  }
}

export default getters
