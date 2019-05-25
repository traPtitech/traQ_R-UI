/* eslint-disable */

declare module 'skyway-js'

interface Options {
  key: string
  debug?: number
  turn?: boolean
  credential?: Credential
  config?: RTCConfiguration
}

interface Credential {
  timestamp?: number
  ttl?: number
  authToken?: string
}

interface CallOptions {
  metadata?: any
  videoBandWidth?: number
  audioBandwidth?: number
  videoCodec?: string
  audioCodec?: string
  videoReceiveEnabled?: boolean
  audioReceiveEnabled?: boolean
  label?: string
}

interface ConnectOptions {
  metadata?: any
  serialization?: string
  dcInit?: RTCDataChannelInit
  label?: string
}

interface RoomOptions {
  mode?: 'sfu' | 'mesh'
  stream?: MediaStream
  videoBandwidth?: number
  audioBandwidth?: number
  videoCodec?: string
  audioCodec?: string
  videoReceiveEnabled?: boolean
  audioReceiveEnabled?: boolean
}

interface SFURoomOptions extends RoomOptions {
  mode: 'sfu'
}

interface MeshRoomOptions extends RoomOptions {
  mode: 'mesh'
}

interface AnswerOptions {
  videoBandwidth?: number
  audioBandwidth?: number
  videoCodec?: string
  audioCodec?: string
}

declare class Peer {
  public connections: any
  public id: string
  public open: boolean
  public rooms: any
  constructor(id: string, options: Options)
  constructor(options: Options)

  public call(
    peerId: string,
    stream?: MediaStream,
    options?: CallOptions
  ): MediaConnection | undefined
  public connect(
    peerId: string,
    options?: ConnectOptions
  ): DataConnection | undefined
  public destroy(): undefined
  public disconnect(): undefined
  public joinRoom(
    roomName: string,
    roomOptions?: SFURoomOptions
  ): SFURoom | undefined | null
  public joinRoom(
    roomName: string,
    roomOptions?: MeshRoomOptions
  ): MeshRoom | undefined | null
  public listAllPeers(cb: (peerIds: string[]) => void): void
  public updateCredential(newCredential: Credential): undefined

  public on(event: string, cb: (ret: any) => void): void
  public on(event: 'open', cb: (id: string) => void): void
  public on(event: 'call', cb: (call: MediaConnection) => void): void
  public on(event: 'close', cb: () => void): void
  public on(event: 'connection', cb: (connection: DataConnection) => void): void
  public on(event: 'disconnected', cb: (id: string) => void): void
  public on(event: 'error', cb: (err: any) => void): void
}

declare class MediaConnection {
  public metadata: any
  public open: boolean
  public remoteId: string
  public peer: string

  public answer(stream: MediaStream, options?: AnswerOptions): undefined
  public close(): void | undefined
  public replaceStream(stream: MediaStream): undefined

  public on(event: string, cb: () => void): void
  public on(event: 'stream', cb: (stream: MediaStream) => void): void
  public on(event: 'close', cb: () => void): void
  public on(
    event: 'removeStream',
    cb: (reamoteStream: MediaStream) => void
  ): void
}

declare class DataConnection {
  public metadata: any
  public open: boolean
  public remoteId: string
  public peer: string

  public send(data: any): void
  public close(): void | undefined

  public on(event: string, cb: () => void): void
  public on(event: 'data', cb: (data: any) => void): void
  public on(event: 'close', cb: () => void): void
}

interface DataObject {
  src: string
  data: any
}

interface MediaStreamWithPeerId extends MediaStream {
  peerId: string
}

declare class MeshRoom {
  public close(): undefined
  public getLog(): undefined
  public replaceStream(stream: MediaSource): undefined
  public send(data: any): undefined

  public on(event: string, cb: () => void): void
  public on(event: 'open', cb: () => void): void
  public on(event: 'peerJoin', cb: (peerId: string) => void): void
  public on(event: 'peerLeave', cb: (peerId: string) => void): void
  public on(event: 'log', cb: (logs: string[]) => void): void
  public once(event: 'log', cb: (logs: string[]) => void): void
  public on(event: 'stream', cb: (stream: MediaStreamWithPeerId) => void): void
  public on(event: 'data', cb: (object: DataObject) => void): void
  public on(event: 'close', cb: () => void): void
  public on(
    event: 'removeStream',
    cb: (stream: MediaStreamWithPeerId) => void
  ): void
}

declare class SFURoom {
  public name: string
  public remoteStreams: Record<string, MediaStreamWithPeerId>
  public members: string[]

  public close(): undefined
  public getLog(): undefined
  public replaceStream(stream: MediaStream): undefined
  public send(data: any): undefined

  public on(event: string, cb: () => void): void
  public on(event: 'open', cb: () => void): void
  public on(event: 'peerJoin', cb: (peerId: string) => void): void
  public on(event: 'peerLeave', cb: (peerId: string) => void): void
  public on(event: 'log', cb: (logs: string[]) => void): void
  public once(event: 'log', cb: (logs: string[]) => void): void
  public on(event: 'stream', cb: (stream: MediaStreamWithPeerId) => void): void
  public on(event: 'data', cb: (object: DataObject) => void): void
  public on(event: 'close', cb: () => void): void
  public on(
    event: 'removeStream',
    cb: (stream: MediaStreamWithPeerId) => void
  ): void
}
