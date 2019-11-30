/**This class is automatically generated by LayaAirIDE, please do not make any modifications. */
import Login from "./Login"
import GameUI from "./script/GameUI"
import GameControl from "./script/GameControl"
import Bullet from "./script/Bullet"
import DropBox from "./script/DropBox"

export default class GameConfig {
    static init() {
        //注册Script或者Runtime引用
        let reg = Laya.ClassUtils.regClass;
		reg("Login.js",Login);
		reg("script/GameUI.js",GameUI);
		reg("script/GameControl.js",GameControl);
		reg("script/Bullet.js",Bullet);
		reg("script/DropBox.js",DropBox);
    }
}
GameConfig.width = 640;
GameConfig.height = 1136;
GameConfig.scaleMode ="fixedwidth";
GameConfig.screenMode = "none";
GameConfig.alignV = "top";
GameConfig.alignH = "left";
GameConfig.startScene = "Login.scene";
GameConfig.sceneRoot = "";
GameConfig.debug = false;
GameConfig.stat = false;
GameConfig.physicsDebug = false;
GameConfig.exportSceneToJson = true;

GameConfig.init();
