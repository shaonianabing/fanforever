//index.js
//获取应用实例
var app = getApp()
Page({

  onShareAppMessage: function () {
    return {
      title: '自定义分享标题',
      desc: '自定义分享描述',
      path: '/page/user?id=123'
    }
  },
  data: {
    warnSize: 'default',
    imgUrl: null,
    address: 'China',
    index: 1,
    userInfo: {}
  },

  detail: function () {
    wx.navigateTo({
      url: '../jz/jz'
    })
    
  },

  collection:function(){
    wx.navigateTo({
      url: '../myCollect/myCollect'
    })
  },

  onLoad: function () {
    
  },
  onShow: function () {
    var that = this
    //调用应用实例的方法获取全局数据
    let uid = wx.getStorageSync('uid')
    if ("" != uid) {
      app.getUserInfo(function (userInfo) {
        //更新数据
        that.setData({
          userInfo: userInfo,
          name: userInfo.nickName
        })
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '您还没有授权登录，请先授权登录!!!',
        showCancel: false,
        confirmText: '去授权',
        success: function (res) {
          if (res.confirm) {
            //再次调用授权
            wx.navigateTo({
              url: '../authorize/authorize'
            })
          }
        }
      })
    }
  },
})
