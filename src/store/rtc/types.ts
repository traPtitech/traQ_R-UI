import traQRTCClient from '@/bin/rtc'

// Temporary root state
// [TODO] Type root state!
export interface TempRS {
  me: {
    name: string
  }
}

export interface S {
  client?: traQRTCClient
  localStream?: MediaStream
  activeVoiceChannelId: string
}
