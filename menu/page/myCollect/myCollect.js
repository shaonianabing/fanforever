// pages/myCollect/myCollect.js
const app = getApp();
let util = require('../../util/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    delBtnWidth: 120,
    offsetRecord: {
      'index': -1,
      'startX': 0,
      'offset': 0,
      'direction': null
    }, 
    list:'',
    pixelScale: 1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
   // that.initEleWidth();
    that.getCollect()
  },
  getCollect:function(){
    let uid = wx.getStorageSync('uid')
    let that = this;
    wx.request({
      url: 'http://localhost:8080/Dc/collection/getMyCollectionById',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      data: {
        uid: uid
      },
      success: function (r) {
        console.log(JSON.stringify(r))
        if (r.data.status == 200) {
          //更新数据
          that.setData({
            list: r.data.obj,
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
  //获取元素自适应后的实际宽度
  getEleWidth: function (w) {
    var real = 0;
    try {
      var res = wx.getSystemInfoSync().windowWidth;
      var scale = (750 / 2) / (w / 2); //以宽度750px设计稿做宽度的自适应
      real = Math.floor(res / scale);
     
      return real;
    } catch (e) {
      return false;
      // Do something when catch error
    }
  },
  initEleWidth: function () {
    var delBtnWidth = this.getEleWidth(this.data.delBtnWidth);
    this.setData({
      delBtnWidth: delBtnWidth
    });
  },
  //移动开始
  touchS: function (e) {
    var that = this;
    if (e.changedTouches.length != 1) {
      return
    }
    let index = e.currentTarget.dataset.index;
    let x = e.changedTouches[0].clientX;
    let offset = 0;
    if (that.data.offsetRecord != null && that.data.offsetRecord.index == index) {
      offset = that.data.offsetRecord.offset;
    }
    that.setData({
      offsetRecord: {
        'index': index,
        'startX': x,
        'offset': offset,
        'direction': null
      }
    });
  },
  //移动中
  touchM: function (e) {
    var that = this;
    if (e.changedTouches.length != 1) return;
    let index = e.currentTarget.dataset.index;
    let record = this.data.offsetRecord;
    if (record == null || index != Reflect.get(record, 'index')) {
      return;
    }
    let clientX = e.changedTouches[0].clientX;
    let startX = Reflect.get(record, 'startX');

    if (Reflect.get(record, 'direction') == undefined) {
      // 记录手势是左滑还是右滑
      let direction = startX >= clientX ? 'left' : 'right';
      Reflect.set(record, 'direction', direction);
    }
    if (Reflect.get(record, 'direction') == 'left') { // 👈滑动
      record.offset = Math.min((startX - clientX) * that.data.pixelScale, that.data.delBtnWidth);
    } else { // 👉滑动
      if (record.offset > 0) {
        record.offset = Math.max(that.data.delBtnWidth - Math.abs(clientX - startX) * that.data.pixelScale, 0);
      } else {
        record = null;
      }
    }
    that.setData({
      offsetRecord: record
    });
  },
  //移动结束
  touchE: function (e) {
    var that = this;
    if (e.changedTouches.length != 1) return;
    let index = e.currentTarget.dataset.index;
    let record = that.data.offsetRecord;
    if (record != null && index == Reflect.get(record, 'index')) {
      let offset = Reflect.get(record, 'offset');
      if (offset >= that.data.delBtnWidth / 2) {
        Reflect.set(record, 'offset', that.data.delBtnWidth);
      } else {
        record = null;
      }
      that.setData({
        offsetRecord: record
      });
    }
  },
  //跳转文章详情
  jumpArticleDetails: function (e) {
    console.log(JSON.stringify(e))
    console.log(e.currentTarget.dataset.article_id)
    wx.navigateTo({
      url: '../Buy/Buy?id=' + e.currentTarget.dataset.article_id,
    })
  },
  //删除浏览记录
  deleteBtn: function (e) {
    let that = this;
    let article_id = e.currentTarget.dataset.article_id;
    that.setData({
      offsetRecord: {
        'index': -1,
        'startX': 0,
        'offset': 0,
        'direction': null
      },
    })
    wx.request({
      url: 'http://localhost:8080/Dc/collection/deleteMyCollectionById',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      data: {
        cId: article_id,
        cUid: wx.getStorageSync('uid')
      },
      success: function (r) {
        if (r.data.status == 200) {
          wx.showToast({
            title: '删除成功',
            icon: 'success',
            duration: 2000
          })
          that.getCollect();
        } else {
          wx.showToast({
            title: '删除失败',
            icon: 'success',
            duration: 2000
          })
        }
      }
    })
    console.log(article_id)
    
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})