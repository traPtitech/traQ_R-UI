export const getUserAudio = async () => {
  const rawAudio = await navigator.mediaDevices.getUserMedia({
    audio: true,
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