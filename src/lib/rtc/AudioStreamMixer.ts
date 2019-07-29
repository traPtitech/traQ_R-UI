const fileSourcePrefix = '__file-'

export default class AudioStreamMixer {
  private sourceNodeMap: Record<string, MediaStreamAudioSourceNode> = {}
  private analyserNodeMap: Record<string, AnalyserNode> = {}
  private gainNodeMap: Record<string, GainNode> = {}
  private context: AudioContext
  private masterVolume = 1
  private previousVolumeMap: Record<string, number> = {}
  readonly analyserFftSize = 128

  constructor() {
    this.context = new ((window as any).AudioContext ||
      (window as any).webkitAudioContext)() as AudioContext
    ;(window as any).showVisualizer = (analyser?: AnalyserNode) => {
      const canvas = document.createElement('canvas')
      const canvas2 = document.createElement('canvas')
      const ctx = canvas.getContext('2d')!
      const ctx2 = canvas2.getContext('2d')!
      document.querySelector('.message-view')!.appendChild(canvas)
      document.querySelector('.message-view')!.appendChild(canvas2)
      const { width, height } = canvas.getClientRects()[0]
      canvas.width = width
      canvas.height = height
      canvas2.width = width
      canvas2.height = height
      analyser = analyser || Object.values(this.analyserNodeMap)[0]
      const draw = () => {
        ctx.clearRect(0, 0, width, height)
        ctx.strokeStyle = 'rgb(20, 107, 226)'

        const bufferLength = analyser!.frequencyBinCount
        const dataArray = new Uint8Array(bufferLength)
        analyser!.getByteTimeDomainData(dataArray)

        ctx.beginPath()
        dataArray.forEach((value, index) => {
          const x = (index / bufferLength) * width
          const y = ((value / 128) * height) / 2
          if (index === 0) {
            ctx.moveTo(x, y)
          } else {
            ctx.lineTo(x, y)
          }
        })
        ctx.lineTo(width, height / 2)
        ctx.stroke()

        ctx2.clearRect(0, 0, width, height)
        ctx2.fillStyle = 'rgb(235, 156, 88)'
        analyser!.getByteFrequencyData(dataArray)

        dataArray.forEach((value, index) => {
          const x = (index / bufferLength) * width
          const h = (value / 256) * height
          ctx2.fillRect(x, height - h, width / bufferLength, h)
        })

        requestAnimationFrame(() => draw())
      }
      draw()
    }
  }

  private createNodeGraph(mediaStream: MediaStream) {
    const source = this.context.createMediaStreamSource(mediaStream)
    const analyser = this.context.createAnalyser()
    const gain = this.context.createGain()
    gain.gain.value = 0.5
    analyser.fftSize = this.analyserFftSize

    gain.connect(this.context.destination)
    analyser.connect(gain)
    source.connect(analyser)
    return { source, gain, analyser }
  }

  private disconnectNodeGraph(
    source: MediaStreamAudioSourceNode,
    analyser: AnalyserNode,
    gain: GainNode
  ) {
    source.disconnect(analyser)
    analyser.disconnect(gain)
    gain.disconnect(this.context.destination)
  }

  public async addStream(key: string, mediaStream: MediaStream) {
    console.log('will add stream')
    if (this.context.state === 'suspended') {
      await this.context.resume()
      console.log('audio context resumed')
    }
    if (mediaStream.getAudioTracks().length === 0) {
      throw 'Invalid audio stream'
    }
    if (key.startsWith(fileSourcePrefix)) {
      throw 'Cannot use this name as audio stream key'
    }
    const { source, gain, analyser } = await this.createNodeGraph(mediaStream)

    // register audio for chrome
    const audio = document.createElement('audio')
    audio.srcObject = mediaStream
    audio.volume = 0

    this.sourceNodeMap[key] = source
    this.analyserNodeMap[key] = analyser
    this.gainNodeMap[key] = gain
  }

  public async removeStream(key: string) {
    this.disconnectNodeGraph(
      this.sourceNodeMap[key],
      this.analyserNodeMap[key],
      this.gainNodeMap[key]
    )

    delete this.gainNodeMap[key]
    delete this.sourceNodeMap[key]
    if (Object.keys(this.gainNodeMap).length === 0) {
      await this.context.suspend()
      console.log('audio context suspended')
    }
  }

  public getVolumeOf(key: string) {
    return this.gainNodeMap[key].gain.value
  }

  public setVolumeOf(key: string, volume: number) {
    this.gainNodeMap[key].gain.value = Math.max(0, Math.min(1, volume))
  }

  public muteAll() {
    Object.keys(this.gainNodeMap).forEach(key => {
      this.previousVolumeMap[key] = this.getVolumeOf(key)
      this.setVolumeOf(key, 0)
    })
  }

  public unmuteAll() {
    Object.keys(this.previousVolumeMap).forEach(key => {
      if (!(key in this.gainNodeMap)) {
        return
      }
      this.setVolumeOf(key, this.previousVolumeMap[key])
    })
    this.previousVolumeMap = {}
  }

  set volume(v: number) {
    const newMasterVolume = Math.max(0, Math.min(1, v))
    Object.values(this.gainNodeMap).forEach(
      gainNode =>
        (gainNode.gain.value =
          (gainNode.gain.value / this.masterVolume) * newMasterVolume)
    )
    this.masterVolume = newMasterVolume
  }
  get volume() {
    return this.masterVolume
  }
}
