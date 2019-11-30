import { Button } from "../release/wxgame/libs/laya.ui";

export default class Home extends Laya.Scene {
    constructor() {
        super();
    }
    onEnable() {
        var create_btn = this.create
        create_btn.on(Laya.Event.CLICK, this, btn_click);
    }
}
function btn_click() {

    Laya.Scene.open("Wait.scene")
}