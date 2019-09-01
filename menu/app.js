var coolsite360 = require('./coolsite/index.js');
var rid = 33
var tid = 0
var menu = [ ]
var apiPath = "http://localhost:8080/Dc/"
var cosPath = "http://data-1252385075.cosgz.myqcloud.com/"

App({
  code: null,
  coolsite360: coolsite360,
  onLaunch: function (options) {
    //调用API从本地缓存中获取数据
    console.log(options)
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
  },
  getUserInfo: function (cb) {
    var that = this
    if (this.globalData.userInfo) {
      typeof cb == "function" && cb(this.globalData.userInfo)
    } else {
      //调用登录接口
      wx.login({
        success: function (res) {
          if (res.code) {
            that.code = res.code
           customLogin(that.code)
          } else {
            console.log('获取登录态失败' + res.errMsg)
          }
          wx.getUserInfo({
            success: function (res) {
              that.globalData.userInfo = res.userInfo
              typeof cb == "function" && cb(that.globalData.userInfo)
            }
          })
        },

        fail: function (res) {
          console.log(fail)
        }
      })
    }
  },

  getCoverUrl: function (did) {
    return cosPath + did + ".jpg"
  },
  getDetailObj: function (did) {
    var detail = wx.getStorageSync("detail-" + did)
    if (detail == undefined) {
      // wx.request({
      //     url: cosPath + did + ".json",
      //     success: function (res) {
      //     wx.setStorageSync("detail-" + did, JSON.stringify(res.data))
      //     return res.data
      //   }
      // })
    }
    return JSON.parse(detail)
  },
  globalData: {
    userInfo: null
  }
})

function customLogin(code) {
  var rid=getRid()
    // wx.request({
    //   url: apiPath + "customLogin.php",
    //   data: {
    //     "code": code, 
    //     "rid": rid,
    //     "menu":menu
    //   },
    //   method: "GET",
    //   success: function (res) {
    //     console.log("返回值"+JSON.stringify(res.data))
    //     console.log("菜单名"+JSON.stringify(res.data.menu))
    //   }
    // })
}

function getRid(){
  return rid
  return menu
}