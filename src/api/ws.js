import Socket from './socket'

class CommonWs {
  constructor(url) {
    this.ws = null
    this.url = url
  }

  connect() {
    this.ws = new Socket(this.url)
  }

  request(payload) {
    if (!this.ws) this.connect()
    this.ws.request(payload)
  }

  subscribe(payload, rollback, callback) {
    if (!this.ws) this.connect()
    this.ws.subscribe({ payload, rollback, callback })
  }

  unSubscribe(id) {
    if (!this.ws) this.connect()
    this.ws.unSubscribe(id)
  }

  close() {
    if (!this.ws) return
    this.ws.close()
  }

  isConnected() {
    return this.ws && this.ws.isConnected()
  }
}
export const ws = new CommonWs('webSocket://192.168.0.110:8080')
