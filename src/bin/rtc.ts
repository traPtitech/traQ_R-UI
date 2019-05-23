import Peer, { SFURoom } from 'skyway-js'
import axios from 'axios'

const skywayApiKey = '2a4e923e-2e16-4d3c-9a39-607c3f605f0a'

export type RTCEventType =
  | 'connect'
  | 'connectionclose'
  | 'disconnect'
  | 'roomopen'
  | 'roomclose'
  | 'peerjoin'
  | 'peerleave'
  | 'streamchange'
  | 'datarecieve'

/**
 * @class リアルタイム系機能を提供するクラス
 */
export default class traQRTCClient {
  private peer?: Peer
  private room?: SFURoom

  private eventTargetDeligator: EventTarget = document.createDocumentFragment()

  constructor(private id: string) {}

  public addEventListener(
    event: RTCEventType,
    listener: EventListener | EventListenerObject | null,
    options?: boolean | AddEventListenerOptions
  ) {
    return this.eventTargetDeligator.addEventListener(event, listener, options)
  }

  public removeEventListener(
    event: RTCEventType,
    listener: EventListener | EventListenerObject | null,
    options?: boolean | EventListenerOptions
  ) {
    return this.eventTargetDeligator.removeEventListener(
      event,
      listener,
      options
    )
  }

  /**
   * @returns a Promise instance to be resolved when a connection has been established.
   */
  public async establishConnection() {
    this.peer = await this.createPeer(this.id)
    this.id = this.peer.id
    return this.id
  }

  /**
   * Join to the room.
   * @param roomName a name of room to join.
   */
  public joinRoom(roomName: string) {
    return new Promise((resolve, reject) => {
      if (!this.peer || !this.peer.open) {
        reject('connection has not been established')
        return
      }
      const room = this.peer.joinRoom(roomName, {
        mode: 'sfu'
      })
      if (!room) {
        reject(`failed to join room: ${roomName}.`)
        return
      }
      room.on('open', this.handleRoomOpen)
      room.on('peerJoin', this.handleRoomPeerJoin)
      room.on('peerLeave', this.handleRoomPeerLeave)
      room.on('stream', this.handleRoomStream)
      room.on('data', this.handleRoomData)
      room.on('close', this.handleRoomClose)
      this.room = room
      resolve()
    })
  }

  public replaceStream(stream: MediaStream) {
    if (!this.peer) {
      throw 'Connection is not established'
    }
    if (!this.room) {
      throw 'Not joined to any room'
    }
    this.room.replaceStream(stream)
  }

  get roomName() {
    return this.room ? this.room.name : ''
  }

  private dispatchEventOfType(type: RTCEventType) {
    this.eventTargetDeligator.dispatchEvent(new Event(type))
  }

  private createPeer(peerId: string) {
    return new Promise<Peer>(async (resolve, reject) => {
      const res = await axios.post('/api/1.0/skyway/authenticate', {
        peerId
      })
      if (res.status !== 200) {
        reject("Couldn't get credential")
        return
      }
      const peer = new Peer(this.id, {
        key: skywayApiKey,
        credential: res.data
      })
      if (!peer) {
        reject("Couldn't establish connection")
        return
      }
      peer.on('open', () => {
        this.dispatchEventOfType('connect')
        resolve(peer)
      })
      peer.on('close', this.handlePeerClose)
      peer.on('disnonected', this.handlePeerDisconnected)
      peer.on('error', this.handlePeerError)
    })
  }

  private dummyRoomJoin() {
    return new Promise(async (resolve, reject) => {
      if (!this.room) {
        reject()
      }
      // create dummy peer with random id
      const dummyPeer = await this.createPeer(
        Math.random()
          .toString(36)
          .slice(-11)
      )
      dummyPeer.on('open', () => {
        const dummyRoom = dummyPeer.joinRoom(this.roomName, { mode: 'sfu' })
        if (!dummyRoom) {
          reject()
          return
        }
        dummyRoom.on('open', () => dummyRoom.close())
        dummyRoom.on('close', () => {
          dummyPeer.destroy()
          resolve()
        })
      })
    })
  }

  private handlePeerClose() {
    this.dispatchEventOfType('connectionclose')
  }
  private handlePeerDisconnected() {
    this.dispatchEventOfType('disconnect')
  }
  private handlePeerError() {
    throw 'Error on peer'
  }
  private async handleRoomOpen() {
    try {
      await this.dummyRoomJoin()
    } catch (err) {
      throw 'Dummy room join failed'
    }
    this.dispatchEventOfType('roomopen')
  }
  private async handleRoomClose() {
    this.dispatchEventOfType('roomclose')
  }
  private async handleRoomPeerJoin() {
    this.dispatchEventOfType('peerjoin')
  }
  private async handleRoomPeerLeave() {
    this.dispatchEventOfType('peerleave')
  }
  private async handleRoomStream(stream: MediaStreamWithPeerId) {
    this.dispatchEventOfType('streamchange')
  }
  private async handleRoomData(data: DataObject) {
    this.dispatchEventOfType('datarecieve')
  }
}
