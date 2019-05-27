import traQRTCClient from '@/lib/rtc/traQRTCClient'

// Temporary root state
// [TODO] Type root state!
export interface TempRS {
  me: {
    name: string
    userId: string
  }
}

export interface S {
  client?: traQRTCClient
  localStream?: MediaStream
  isActive: boolean
  isCalling: boolean
  activeMediaChannelId: string
  remoteAudioStreamMap: Record<string, MediaStream>
  remoteVideoStreamMap: Record<string, MediaStream>
}
