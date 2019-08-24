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
