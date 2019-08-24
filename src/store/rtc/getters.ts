import { GetterTree } from 'vuex'
import { S, TempRS } from './types'

const getters: GetterTree<S, TempRS> = {
  remoteAudioStreams({ remoteAudioStreamMap }) {
    return Object.values(remoteAudioStreamMap)
  },
  remoteVideoStreams({ remoteVideoStreamMap }) {
    return Object.values(remoteVideoStreamMap)
  },
  isCallingOnCurrentChannel({ activeMediaChannelId }, _, { currentChannel }) {
    return activeMediaChannelId === currentChannel.channelId
  }
}

export default getters
