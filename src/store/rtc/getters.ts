import { GetterTree } from 'vuex'
import { S, TempRS } from './types'

const getters: GetterTree<S, TempRS> = {
  remoteAudioStreams({ remoteAudioStreamMap }) {
    return Object.values(remoteAudioStreamMap)
  },
  remoteVideoStreams({ remoteVideoStreamMap }) {
    return Object.values(remoteVideoStreamMap)
  }
}

export default getters
