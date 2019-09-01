const app = getApp();
Page({
  data: {
    //判断小程序的API，回调，参数，组件等是否在当前版本可用。
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  onLoad: function () {
    var that = this;
    // 查看是否授权
    // wx.getSetting({
    //   success: function (res) {
    //     if (res.authSetting['scope.userInfo']) {
    //       wx.getUserInfo({
    //         success: function (res) {
    //           //从数据库获取用户信息
    //           that.queryUsreInfo();
    //           wx.showLoading({
    //             title: '登录成功',
    //           })

    //           //用户已经授权过
    //           setTimeout(function () {
    //             wx.hideLoading()
    //             wx.switchTab({
    //               url: '/page/index/index'
    //             })
    //           }, 2000)
    //         }
    //       });
    //     }
    //   }
    // })
  },
  bindGetUserInfo: function (e) {
    if (e.detail.userInfo) {
      //用户按了允许授权按钮
      var that = this;
      wx.showLoading({
        title: '努力登录中...',
      })
      wx.login({
        success : function(res){
          console.log(res)
          wx.request({
            url: 'http://localhost:8080/Dc/login/userLogin',
            header: { "Content-Type": "application/x-www-form-urlencoded" },
            method: 'POST',
            data: {
              nickName: e.detail.userInfo.nickName,
              avatarUrl: e.detail.userInfo.avatarUrl,
              province: e.detail.userInfo.province,
              city: e.detail.userInfo.city,
              code:res.code,
              encryptedData: e.detail.encryptedData,
              iv: e.detail.iv
            },
            success: function (r) {
              if (r.data.status == 200) {
                wx.hideLoading();
                console.log(JSON.stringify(r))
                wx.setStorage({
                  key: 'uid',
                  data: r.data.obj,
                })
                //授权成功后，跳转进入小程序首页
                wx.showLoading({
                  title: '登录成功',
                })
                setTimeout(function () {
                  wx.hideLoading()
                  wx.navigateBack({
                    delta: 1
                  })
                }, 2000)
              } else {
                  
              }
            }, fail: function () {
              wx.showLoading({
                title: '网络异常',
              })
              setTimeout(function () {
                wx.hideLoading()
              }, 2000)
            }
          })
        }
      })
    } else {
      //用户按了拒绝按钮
      wx.showModal({
        title: '警告',
        content: '您点击了拒绝授权，将无法进入小程序，请授权之后再进入!!!',
        showCancel: false,
        confirmText: '返回授权',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击了“返回授权”')
          }
        }
      })
    }
  },
  //获取用户信息接口
  queryUsreInfo: function () {
    wx.request({
      url: app.globalData.urlPath + 'user/userInfo',
      data: {
        openid: app.globalData.openid
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log(res.data);
        getApp().globalData.userInfo = res.data;
      }
    })
  },

})
