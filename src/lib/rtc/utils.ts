export const getUserAudio = async () => {
  const rawAudio = await (navigator.mediaDevices.getUserMedia as any)({
    audio: {
      noiseSuppression: false,
      echoCancellation: false,
      audioGainControl: false
    },
    video: false
  })
  return rawAudio
}

export const getUserDisplay = async () => {
  const rawVideo = await (navigator.mediaDevices as any).getDisplayMedia({
    audio: false,
    video: true
  })
  return rawVideo
}
