import api from "./api.js"

export default class WS extends Laya.Scene {
    constructor() {
        super();
        this.socket = null
    }
    onEnable() {
        this.btnCon.on(Laya.Event.CLICK, this, this.connect)
        this.btnSend.on(Laya.Event.CLICK, this, this.send)
    }
    connect() {
        api.init()
    }
    send() {
        api.createRoom()
    }
}