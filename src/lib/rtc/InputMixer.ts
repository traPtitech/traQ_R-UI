export class InputMixer {
  private _stream: MediaStream
  private context: AudioContext

  constructor(stream: MediaStream) {
    if (stream.getAudioTracks().length === 0) {
      throw 'Invalid audio stream'
    }
    this._stream = stream
    this.context = new AudioContext()
  }

  get stream() {
    return this._stream
  }
}
