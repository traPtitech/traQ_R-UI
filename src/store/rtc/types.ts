import traQRTCClient from '@/lib/rtc/traQRTCClient'
import AudioStreamMixer from '@/lib/rtc/AudioStreamMixer'
import { WebRTCUserState } from 'traq-api'

// Temporary root state
// [TODO] Type root state!
export interface TempRS {
  me: {
    name: string
    userId: string
  }
  currentChannel: {
    channelId: string
  }
}

export interface S {
  client?: traQRTCClient
  mixer?: AudioStreamMixer
  localStream?: MediaStream
  rtcState: string[]
  isRtcEnabled: boolean
  isMicMuted: boolean
  activeMediaChannelId: string
  userStateMap: Record<string, WebRTCUserState>
  userVolumeMap: Record<string, number>
  remoteAudioStreamMap: Record<string, MediaStream>
  remoteVideoStreamMap: Record<string, MediaStream>
  audioInputDeviceId: string
  audioOutputDeviceId: string
}
