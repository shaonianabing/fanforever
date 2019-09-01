var detail = require('../../data/posts-data.js');
var common = require('../../util/util.js');

// 引入coolsite360交互配置设定
require('coolsite.config.js');
// 获取全局应用程序实例对象
var app = getApp();
// 创建页面实例对象
Page({
  data: {
    item:{}, 
    sc:'',
    shop:'',
    showModalStatus: false,
    tllb:{}
  },
  postData: {},

  onLoad: function(option) {
    // 获取到加入购物车选项信息
    var that = this;
    that.getShopState()
    var postId = option.id;
    that.getsc(postId);
    console.log(postId)
    wx.request({
      url: 'http://localhost:8080/Dc/goods/getGoodsById',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      data:{
        goodsId: postId
      },
      success: function (r) {
        if (r.data.status == 200) {
          //更新数据
          that.setData({
            item: r.data.obj,
          })
        } else {
          wx.showToast({
            title: '暂无数据',
            icon: 'success',
            duration: 2000
          })
        }
      }
    })
  },

  getShopState: function () {
    let that = this;
    wx.request({
      url: 'http://localhost:8080/Dc/myShop/getMyShop',
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      method: 'POST',
      success: function (r) {
        console.log(JSON.stringify(r))
        if (r.data.status == 200) {
          that.setData({
            shop: r.data.obj.sState
          })
          console.log(that.data.shop)
        } else {

        }
      }
    })
  },
  getsc: function (option){
  let that = this;
  wx.request({
    url: 'http://localhost:8080/Dc/collection/getSFSC',
    header: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    method: 'POST',
    data: {
      uid: wx.getStorageSync('uid'),
      gid: option
    },
    success: function (r) {
      if (r.data.status == 200) {
       that.setData({
         sc:'../../images/wdsc.png'
       })
      } else {
         that.setData({
           sc: '../../images/wdsch.png'
         })
      }
      console.log(r)
    }
  })
},
  setModalStatusZt:function(){
    wx.showToast({
      title: '暂停营业',
      icon:'none',
      duration:2000
    })
  },
  // 触发coolsite360交互事件
  onShow() {
    app.coolsite360.onShow(this);
  },
  tap_3013baf2: function (e) {
    app.coolsite360.fireEvent(e, this);
  },
  tap_d5808da3: function (e) {
    app.coolsite360.fireEvent(e, this);
  },


  // 显示隐藏购物车
  showCartDetail: function () {
    this.setData({
      showCartDetail: !this.data.showCartDetail
    });
  },
  hideCartDetail: function () {
    this.setData({
      showCartDetail: false
    });
  },

  // 抽屉显示和隐藏
  //下单
  setModalStatus: function (e) {
    let that = this
    wx.request({
      url: 'http://localhost:8080/Dc/goodsOrder/setgOrder',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      data: {
        id: that.data.item.goodsId,
        uid: wx.getStorageSync('uid')
      },
      success: function (r) {
        console.log(r)
        if (r.data.status == 200) {
          wx.showToast({
            title: '下单成功',
            icon: 'success',
            duration: 2000
          })

          setTimeout(function () {
            // wx.hideLoading()
            wx.navigateBack({
              delta: 1
            })
          }, 2000)
        } else {
          wx.showToast({
            title: '下单失败',
            icon: 'success',
            duration: 2000
          })
        }
      }
    })
  },
  setcollection:function(e){
    let that = this;
    console.log(e.currentTarget.id)
    let uid = wx.getStorageSync('uid')
    if ("" != uid) {
      wx.request({
        url: 'http://localhost:8080/Dc/collection/myCollection',
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        method: 'POST',
        data: {
          uid: uid,
          gid: e.currentTarget.id
        },
        success: function (r) {
          if (r.data.msg == '收藏成功'){
            that.setData({
              sc: '../../images/wdsc.png'
            })
            wx.showToast({
              title: r.data.msg,
            })
          }else{
            that.setData({
              sc: '../../images/wdsch.png'
            })
            wx.showToast({
              title: r.data.msg,
            })
          }
          console.log(r)
        }
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
  
  powerDrawer: function (e) {
    console.log("11111"+JSON.stringify(e))
    var currentStatu = e.currentTarget.dataset.statu;
    let uid = wx.getStorageSync('uid')
    if ("" != uid) {
       this.util(currentStatu)
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
  util: function (currentStatu) {
    console.log(currentStatu)
    /* 动画部分 */
    // 第1步：创建动画实例 
    var animation = wx.createAnimation({
      duration: 200,  //动画时长
      timingFunction: "linear", //线性
      delay: 0  //0则不延迟
    });

    // 第2步：这个动画实例赋给当前的动画实例
    this.animation = animation;

    // 第3步：执行第一组动画
    animation.opacity(0).rotateX(-100).step();

    // 第4步：导出动画对象赋给数据对象储存
    this.setData({
      animationData: animation.export()
    })

    // 第5步：设置定时器到指定时候后，执行第二组动画
    setTimeout(function () {
      // 执行第二组动画
      animation.opacity(1).rotateX(0).step();
      // 给数据对象储存的第一组动画，更替为执行完第二组动画的动画对象
      this.setData({
        animationData: animation
      })
      //关闭
      if (currentStatu == "close") {
        this.setData(
          {
            showModalStatus: false
          }
        );
      }
    }.bind(this), 200)

    // 显示
    if (currentStatu == "open") {
      let that = this;
      let gid = that.data.item.goodsId
      wx.request({
        url: 'http://localhost:8080/Dc/condiment/getCondimentByList',
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        method: 'POST',
        data: {
          gid: gid
        },
        success: function (r) {
          if (r.data.status == 200){
            console.log(r.data.obj)
            that.setData({
              tllb: r.data.obj,
              showModalStatus: true
            })
          }else{
            that.setModalStatus()
          }
          console.log(that.data.tllb) 
        }
      })
    }
    // 确定点餐
    if (currentStatu == "que") {
      let that = this;
      let gid = that.data.item.goodsId
      console.log(gid)
      that.setData({
        showModalStatus: false
      })
    }
  },
  formSubmit: function (e) {
    let that = this
    that.setData({
      showModalStatus: false
    })
    let tls = JSON.stringify(e.detail.value);
    let uid = wx.getStorageSync('uid')
    wx.showLoading({
      title: '下单中',
    })
      wx.request({
        url: 'http://localhost:8080/Dc/goodsOrder/setgOrder',
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        method: 'POST',
        data: {
          id: that.data.item.goodsId,
          tl: tls,
          uid: uid
        },
        success: function (r) {
          console.log(r)
          wx.hideLoading()
          if (r.data.status == 200) {
            wx.showToast({
              title: '下单成功',
              icon: 'success',
              duration: 2000
            })

            setTimeout(function () {
              // wx.hideLoading()
              wx.navigateBack({
                delta: 1
              })
            }, 2000)
          } else {
            wx.showToast({
              title: '下单失败',
              icon: 'success',
              duration: 2000
            })
          }
        }
      })
   
  },

  // 微信支付实现
  // wxpay: function () {
  //   var code = app.code;
  //   var url = 'https://www.xxy1978.com/wxpay/example/jsapi.php';
  //   wx.request({
  //     url: url,
  //     data: {
  //       code: code,
  //     },
  //     method: 'GET',
  //     header: {
  //       'content-type': 'application/json'
  //     },
  //     success: function (res) {
  //       wx.requestPayment({
  //         timeStamp: res.data.timeStamp,
  //         nonceStr: res.data.nonceStr,
  //         package: res.data.package,
  //         signType: 'MD5',
  //         paySign: res.data.paySign,
  //         success: function (res) {
  //           wx.showToast({
  //             title: '支付成功',
  //             icon: 'success',
  //             duration: 3000
  //           });
  //         },
  //         fail: function (res) {
  //           console.log("支付失败")
  //         },
  //       })
  //     }
  //   })
  // }
  
})

