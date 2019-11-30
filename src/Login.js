export default class Login extends Laya.Scene {
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
                    console.error(res)
                    return
                }
                btn.hide()
                // Laya.Scene.open('test/TestScene.scene')
                Laya.Scene.open("Home.scene")
            })
        } else {
            // Laya.Scene.close('Login.scene')
            Laya.Scene.open('test/TestScene.scene', true, ()=>{console.log("loaded")})
        }
    }
}