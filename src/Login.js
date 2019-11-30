window.global = {}

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
                window.global.userInfo = res.userInfo
                Laya.Scene.open('testws.scene')
            })
            // window.wx.authorize({scoop: "scoop.userInfo"})
        } else {
            // Laya.Scene.close('Login.scene')
            console.log('other browser')
            window.global.userInfo = {
                nickName: 'nickname',
                avatarUrl: 'https://www.baidu.com/img/bd_logo1.png',
                gender: 0,
            }
            Laya.Scene.open('testws.scene', true, () => { console.log("loaded") })
        }
    }
}