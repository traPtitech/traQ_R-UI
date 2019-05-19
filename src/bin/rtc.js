import Peer from 'skyway-js'
import axios from '@/bin/axios'

// [FIXME] どうにかする
const skywayApiKey = '2a4e923e-2e16-4d3c-9a39-607c3f605f0a'

/**
 * @class traQRTCClient リアルタイム系機能を提供するクラス
 */
export default class traQRTCClient extends EventTarget {
  /**
   * @property {Peer} peer peer instance of connction.
   */
  peer = null

  /**
   * @property {SFURoom} peer peer instance of connction.
   */
  room = null

  /**
   * @property {string} id id to use for connection.
   */
  id = ''

  /**
   * @param {string} id
   */
  constructor(id) {
    super()
    this.id = id
    // this.peer = new Peer({
    //   key: apiKey
    // })
  }

  /**
   * @returns {Promise} a Promise instance to be resolved when a connection has been established.
   */
  establishConnection() {
    return new Promise(async (resolve, reject) => {
      const res = await axios.post('/api/1.0/skyway/authenticate', {
        peerId: this.id
      })
      if (res.status !== 200) {
        reject()
      }
      this.peer = new Peer(this.id, {
        key: skywayApiKey,
        credential: res.data
      })
      this.peer.on('open', () => {
        this.id = this.peer.id
        resolve(this.id)
      })
      this.peer.on('open', () => {
        this.id = this.peer.id
        resolve(this.id)
      })
    })
  }

  /**
   * @param {string} roomName a name of room to join.
   */
  joinRoom(roomName) {
    return new Promise((resolve, reject) => {
      if (!this.peer || !this.peer.open) {
        reject('connection has not been established')
      }
      this.room = this.peer.joinRoom(roomName, {
        mode: 'sfu'
      })
      if (!this.room) {
        reject(`failed to join room: ${roomName}.`)
      }
      // [TODO] setup room event handlers
    })
  }
}
