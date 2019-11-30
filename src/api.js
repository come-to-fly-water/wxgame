var socket = null
var onerror = null

var host = 'localhost'
var port = 5000

class WSManager {
    constructor(socket) {
        this.socket = socket
        this.queue = []
        this.busy = false
        this.currCallback = null
        this.socket.on(Laya.Event.OPEN, this, this.openHandler)
        this.socket.on(Laya.Event.MESSAGE, this, this.messageHandler)
        this.socket.on(Laya.Event.CLOSE, this, this.closeHandler)
        this.socket.on(Laya.Event.ERROR, this, this.errorHandler)
    }
    send(str, cb) {
        if (this.busy) {
            this.queue.push([str, cb])
        } else {
            this.busy = true
            this.currCallback = cb
            this._send(str)
        }
    }
    _send(str) {
        this.socket.send(str)
    }
    openHandler(event) {
        console.log(event)
    }
    messageHandler(msg) {
        // TODO error process
        let obj = JSON.parse(msg)
        console.log('received: ' + obj)
        if (this.currCallback)
            this.currCallback(obj)
        if (this.queue.length == 0) {
            this.busy = false
            return
        }
        next = this.queue.pop()
        this.currCallback = next[1]
        this._send(next[0])
    }
    closeHandler() {
        // TODO onclose
        console.log('closed')
    }
    errorHandler(err) {
        console.log(err)
        if (onerror) {
            onerror(err)
        }
    }
}

function init() {
    if (!window.global.userInfo) {
        console.error('获取用户信息失败')
    }
    if (!Laya.Browser.onWeiXin) {
        uid = 'dummyid'
    }
    else {
        window.wx.login({
            success: function (res) {
                console.log('login success')
                uid = res.code
            },
            fail: function (res) {
                console.error(res)
            }
        })
    }
    if (this.socket && this.socket.socket.connected)
        return
    socket = new WSManager(new Laya.Socket(host, port))
}


/* api */

var uid = null // 用户的唯一标识符

function createRoom() {
    socket.send(JSON.stringify({
        user: { id: uid },
        data: {
            avatarUrl: window.global.userInfo.avatarUrl,
        }
    }), (res) => {
        console.log(res)
    })
}

/* api */

export default {
    createRoom,
    init,
    onerror
}