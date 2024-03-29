(function () {
    'use strict';

    window.global = {};

    class Login extends Laya.Scene {
        constructor() {
            super();
        }
        onEnable() {
            if (Laya.Browser.onWeiXin) {
                let btn = window.wx.createUserInfoButton({
                    type: 'text',
                    text: '验证登录',
                    style: {
                        left: 50,
                        top: 500,
                        width: 200,
                        height: 70,
                        lineHeight: 70,
                        backgroundColor: 'red',
                        color: 'white',
                        textAlign: 'center',
                        fontSize: 16,
                        borderRadius: 4
                    },
                    withCredentials: false,
                });
                btn.onTap((res) => {
                    if (!res.userInfo)
                        return
                    btn.hide();
                    window.global.userInfo = res.userInfo;
                    Laya.Scene.open('testws.scene');
                });
                // window.wx.authorize({scoop: "scoop.userInfo"})
            } else {
                // Laya.Scene.close('Login.scene')
                console.log('other browser');
                window.global.userInfo = {
                    nickName: 'nickname',
                    avatarUrl: 'https://www.baidu.com/img/bd_logo1.png',
                    gender: 0,
                };
                Laya.Scene.open('testws.scene', true, () => { console.log("loaded"); });
            }
        }
    }

    /**
     * 子弹脚本，实现子弹飞行逻辑及对象池回收机制
     */
    class Bullet extends Laya.Script {
        constructor() { super(); }
        onEnable() {
            //设置初始速度
            var rig = this.owner.getComponent(Laya.RigidBody);
            rig.setVelocity({ x: 0, y: -10 });
        }

	    Laya.Scene.open("Wait.scene");
	}

	class Login extends Laya.Scene {
	    constructor() {
	        super();
	    }
	    onEnable() {
	        if (Laya.Browser.onWeiXin) {
	            let btn = window.wx.createUserInfoButton({
	                type: 'text',
	                text: '验证登录',
	                style: {
	                    left: 50,
	                    top: 500,
	                    width: 200,
	                    height: 70,
	                    lineHeight: 70,
	                    backgroundColor: 'red',
	                    color: 'white',
	                    textAlign: 'center',
	                    fontSize: 16,
	                    borderRadius: 4
	                },
	                withCredentials: false,
	            });
	            btn.onTap((res) => {
	                if (!res.userInfo) {
	                    console.error(res);
	                    return
	                }
	                btn.hide();
	                // Laya.Scene.open('test/TestScene.scene')
	                Laya.Scene.open("Home.scene");
	            });
	        } else {
	            // Laya.Scene.close('Login.scene')
	            Laya.Scene.open('test/TestScene.scene', true, ()=>{console.log("loaded");});
	        }
	    }
	}

	/**
	 * 子弹脚本，实现子弹飞行逻辑及对象池回收机制
	 */
	class Bullet extends Laya.Script {
	    constructor() { super(); }
	    onEnable() {
	        //设置初始速度
	        var rig = this.owner.getComponent(Laya.RigidBody);
	        rig.setVelocity({ x: 0, y: -10 });
	    }

	    onTriggerEnter(other, self, contact) {
	        //如果被碰到，则移除子弹
	        this.owner.removeSelf();
	    }

	    onUpdate() {
	        //如果子弹超出屏幕，则移除子弹
	        if (this.owner.y < -10) {
	            this.owner.removeSelf();
	        }
	    }

	    onDisable() {
	        //子弹被移除时，回收子弹到对象池，方便下次复用，减少对象创建开销
	        Laya.Pool.recover("bullet", this.owner);
	    }
	}

	/**
	 * 游戏控制脚本。定义了几个dropBox，bullet，createBoxInterval等变量，能够在IDE显示及设置该变量
	 * 更多类型定义，请参考官方文档
	 */
	class GameControl extends Laya.Script {
	    /** @prop {name:dropBox,tips:"掉落容器预制体对象",type:Prefab}*/
	    /** @prop {name:bullet,tips:"子弹预制体对象",type:Prefab}*/
	    /** @prop {name:createBoxInterval,tips:"间隔多少毫秒创建一个下跌的容器",type:int,default:1000}*/

	    constructor() { super(); }
	    onEnable() {
	        //间隔多少毫秒创建一个下跌的容器
	        this.createBoxInterval = 1000;
	        //开始时间
	        this._time = Date.now();
	        //是否已经开始游戏
	        this._started = false;
	        //子弹和盒子所在的容器对象
	        this._gameBox = this.owner.getChildByName("gameBox");
	    }

	    onUpdate() {
	        //每间隔一段时间创建一个盒子
	        let now = Date.now();
	        if (now - this._time > this.createBoxInterval&&this._started) {
	            this._time = now;
	            this.createBox();
	        }
	    }

	    createBox() {
	        //使用对象池创建盒子
	        let box = Laya.Pool.getItemByCreateFun("dropBox", this.dropBox.create, this.dropBox);
	        box.pos(Math.random() * (Laya.stage.width - 100), -100);
	        this._gameBox.addChild(box);
	    }

	    onStageClick(e) {
	        //停止事件冒泡，提高性能，当然也可以不要
	        e.stopPropagation();
	        //舞台被点击后，使用对象池创建子弹
	        let flyer = Laya.Pool.getItemByCreateFun("bullet", this.bullet.create, this.bullet);
	        flyer.pos(Laya.stage.mouseX, Laya.stage.mouseY);
	        this._gameBox.addChild(flyer);
	    }

	    /**开始游戏，通过激活本脚本方式开始游戏*/
	    startGame() {
	        if (!this._started) {
	            this._started = true;
	            this.enabled = true;
	        }
	    }

	    /**结束游戏，通过非激活本脚本停止游戏 */
	    stopGame() {
	        this._started = false;
	        this.enabled = false;
	        this.createBoxInterval = 1000;
	        this._gameBox.removeChildren();
	    }
	}

	/**
	 * 本示例采用非脚本的方式实现，而使用继承页面基类，实现页面逻辑。在IDE里面设置场景的Runtime属性即可和场景进行关联
	 * 相比脚本方式，继承式页面类，可以直接使用页面定义的属性（通过IDE内var属性定义），比如this.tipLbll，this.scoreLbl，具有代码提示效果
	 * 建议：如果是页面级的逻辑，需要频繁访问页面内多个元素，使用继承式写法，如果是独立小模块，功能单一，建议用脚本方式实现，比如子弹脚本。
	 */
	class GameUI extends Laya.Scene {
	    constructor() {
	        super();
	        //设置单例的引用方式，方便其他类引用
	        GameUI.instance = this;
	        //关闭多点触控，否则就无敌了
	        Laya.MouseManager.multiTouchEnabled = false;
	        //加载场景文件
	        this.loadScene("test/TestScene.scene");
	    }

	    onEnable() {
	        //戏控制脚本引用，避免每次获取组件带来不必要的性能开销
	        this._control = this.getComponent(GameControl);
	        //点击提示文字，开始游戏
	        this.tipLbll.on(Laya.Event.CLICK, this, this.onTipClick);
	    }

	    onTipClick(e) {
	        this.tipLbll.visible = false;
	        this._score = 0;
	        this.scoreLbl.text = "";
	        this._control.startGame();
	    }

        /**停止游戏 */
        stopGame() {
            this.tipLbll.visible = true;
            this.tipLbll.text = "游戏结束了，点击屏幕重新开始";
            this._control.stopGame();
        }
    }

    var socket = null;
    var onerror = null;

    var host = 'localhost';
    var port = 5000;

    class WSManager {
        constructor(socket) {
            this.socket = socket;
            this.queue = [];
            this.busy = false;
            this.currCallback = null;
            this.socket.on(Laya.Event.OPEN, this, this.openHandler);
            this.socket.on(Laya.Event.MESSAGE, this, this.messageHandler);
            this.socket.on(Laya.Event.CLOSE, this, this.closeHandler);
            this.socket.on(Laya.Event.ERROR, this, this.errorHandler);
        }
        send(str, cb) {
            if (this.busy) {
                this.queue.push([str, cb]);
            } else {
                this.busy = true;
                this.currCallback = cb;
                this._send(str);
            }
        }
        _send(str) {
            this.socket.send(str);
        }
        openHandler(event) {
            console.log(event);
        }
        messageHandler(msg) {
            // TODO error process
            let obj = JSON.parse(msg);
            console.log('received: ' + obj);
            if (this.currCallback)
                this.currCallback(obj);
            if (this.queue.length == 0) {
                this.busy = false;
                return
            }
            next = this.queue.pop();
            this.currCallback = next[1];
            this._send(next[0]);
        }
        closeHandler() {
            // TODO onclose
            console.log('closed');
        }
        errorHandler(err) {
            console.log(err);
        }
    }

    function init() {
        if (!window.global.userInfo) {
            console.error('获取用户信息失败');
        }
        if (!Laya.Browser.onWeiXin) {
            uid = 'dummyid';
        }
        else {
            window.wx.login({
                success: function (res) {
                    console.log('login success');
                    uid = res.code;
                },
                fail: function (res) {
                    console.error(res);
                }
            });
        }
        if (this.socket && this.socket.socket.connected)
            return
        socket = new WSManager(new Laya.Socket(host, port));
    }


    /* api */

    var uid = null; // 用户的唯一标识符

    function createRoom() {
        socket.send(JSON.stringify({
            user: { id: uid },
            data: {
                avatarUrl: window.global.userInfo.avatarUrl,
            }
        }), (res) => {
            console.log(res);
        });
    }

    /* api */

    var api = {
        createRoom,
        init,
        onerror
    };

    class WS extends Laya.Scene {
        constructor() {
            super();
            this.socket = null;
        }
        onEnable() {
            this.btnCon.on(Laya.Event.CLICK, this, this.connect);
            this.btnSend.on(Laya.Event.CLICK, this, this.send);
        }
        connect() {
            api.init();
        }
        send() {
            api.createRoom();
        }
    }

    /**
     * 掉落盒子脚本，实现盒子碰撞及回收流程
     */
    class DropBox extends Laya.Script {
        constructor() { super(); }
        onEnable() {
            /**获得组件引用，避免每次获取组件带来不必要的查询开销 */
            this._rig = this.owner.getComponent(Laya.RigidBody);
            //盒子等级
            this.level = Math.round(Math.random() * 5) + 1;
            //等级文本对象引用
            this._text = this.owner.getChildByName("levelTxt");
            this._text.text = this.level + "";
        }

	    /**停止游戏 */
	    stopGame() {
	        this.tipLbll.visible = true;
	        this.tipLbll.text = "游戏结束了，点击屏幕重新开始";
	        this._control.stopGame();
	    }
	}

	/**
	 * 掉落盒子脚本，实现盒子碰撞及回收流程
	 */
	class DropBox extends Laya.Script {
	    constructor() { super(); }
	    onEnable() {
	        /**获得组件引用，避免每次获取组件带来不必要的查询开销 */
	        this._rig = this.owner.getComponent(Laya.RigidBody);
	        //盒子等级
	        this.level = Math.round(Math.random() * 5) + 1;
	        //等级文本对象引用
	        this._text = this.owner.getChildByName("levelTxt");
	        this._text.text = this.level + "";
	    }

	    onUpdate() {
	        //让持续盒子旋转
	        this.owner.rotation++;
	    }

	    onTriggerEnter(other, self, contact) {
	        var owner = this.owner;
	        if (other.label === "buttle") {
	            //碰撞到子弹后，增加积分，播放声音特效
	            if (this.level > 1) {
	                this.level--;
	                this._text.changeText(this.level + "");
	                owner.getComponent(Laya.RigidBody).setVelocity({ x: 0, y: -10 });
	                Laya.SoundManager.playSound("sound/hit.wav");
	            } else {
	                if (owner.parent) {
	                    let effect = Laya.Pool.getItemByCreateFun("effect", this.createEffect, this);
	                    effect.pos(owner.x, owner.y);
	                    owner.parent.addChild(effect);
	                    effect.play(0, true);
	                    owner.removeSelf();
	                    Laya.SoundManager.playSound("sound/destroy.wav");
	                }
	            }
	            GameUI.instance.addScore(1);
	        } else if (other.label === "ground") {
	            //只要有一个盒子碰到地板，则停止游戏
	            owner.removeSelf();
	            GameUI.instance.stopGame();
	        }
	    }

	    /**使用对象池创建爆炸动画 */
	    createEffect() {
	        let ani = new Laya.Animation();
	        ani.loadAnimation("test/TestAni.ani");
	        ani.on(Laya.Event.COMPLETE, null, recover);
	        function recover() {
	            ani.removeSelf();
	            Laya.Pool.recover("effect", ani);
	        }
	        return ani;
	    }

	    onDisable() {
	        //盒子被移除时，回收盒子到对象池，方便下次复用，减少对象创建开销。
	        Laya.Pool.recover("dropBox", this.owner);
	    }
	}

	/**This class is automatically generated by LayaAirIDE, please do not make any modifications. */

    class GameConfig {
        static init() {
            //注册Script或者Runtime引用
            let reg = Laya.ClassUtils.regClass;
    		reg("Login.js",Login);
    		reg("script/GameUI.js",GameUI);
    		reg("script/GameControl.js",GameControl);
    		reg("WS.js",WS);
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

	class Main {
		constructor() {
			//根据IDE设置初始化引擎		
			if (window["Laya3D"]) Laya3D.init(GameConfig.width, GameConfig.height);
			else Laya.init(GameConfig.width, GameConfig.height, Laya["WebGL"]);
			Laya["Physics"] && Laya["Physics"].enable();
			Laya["DebugPanel"] && Laya["DebugPanel"].enable();
			Laya.stage.scaleMode = GameConfig.scaleMode;
			Laya.stage.screenMode = GameConfig.screenMode;
			Laya.stage.alignV = GameConfig.alignV;
			Laya.stage.alignH = GameConfig.alignH;
			//兼容微信不支持加载scene后缀场景
			Laya.URL.exportSceneToJson = GameConfig.exportSceneToJson;

			//打开调试面板（通过IDE设置调试模式，或者url地址增加debug=true参数，均可打开调试面板）
			if (GameConfig.debug || Laya.Utils.getQueryString("debug") == "true") Laya.enableDebugPanel();
			if (GameConfig.physicsDebug && Laya["PhysicsDebugDraw"]) Laya["PhysicsDebugDraw"].enable();
			if (GameConfig.stat) Laya.Stat.show();
			Laya.alertGlobalError = true;

    		//激活资源版本控制，version.json由IDE发布功能自动生成，如果没有也不影响后续流程
    		Laya.ResourceVersion.enable("version.json", Laya.Handler.create(this, this.onVersionLoaded), Laya.ResourceVersion.FILENAME_VERSION);

    		window.global = {};
    	}

		onVersionLoaded() {
			//激活大小图映射，加载小图的时候，如果发现小图在大图合集里面，则优先加载大图合集，而不是小图
			Laya.AtlasInfoManager.enable("fileconfig.json", Laya.Handler.create(this, this.onConfigLoaded));
		}

		onConfigLoaded() {
			//加载IDE指定的场景
			GameConfig.startScene && Laya.Scene.open(GameConfig.startScene);
		}
	}
	//激活启动类
	new Main();

}());
