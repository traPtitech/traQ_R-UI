import traQRTCClient from '@/bin/rtc'

// Temporary root state
// [TODO] Type root state!
export interface TempRS {
  me: {
    name: string
    userId: string
  }
}

export interface S {
  isJoined: boolean
  client?: traQRTCClient
  localStream?: MediaStream
  activeVoiceChannelId: string
  remoteAudioStreamMap: Record<string, MediaStream>
  remoteVideoStreamMap: Record<string, MediaStream>
}
