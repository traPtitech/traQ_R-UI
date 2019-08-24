import traQRTCClient from '@/lib/rtc/traQRTCClient'
import AudioStreamMixer from '@/lib/rtc/AudioStreamMixer'

// Temporary root state
// [TODO] Type root state!
export interface TempRS {
  me: {
    name: string
    userId: string
  },
  currentChannel: {
    channelId: string
  }
}

export interface S {
  client?: traQRTCClient
  mixer?: AudioStreamMixer
  localStream?: MediaStream
  isRtcEnabled: boolean
  isActive: boolean
  isCalling: boolean
  isMicMuted: boolean
  activeMediaChannelId: string
  userVolumeMap: Record<string, number>
  remoteAudioStreamMap: Record<string, MediaStream>
  remoteVideoStreamMap: Record<string, MediaStream>
  audioInputDeviceId: string,
  audioOutputDeviceId: string
}
