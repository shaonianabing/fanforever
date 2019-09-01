// 默认声明一个函数记录list显示的数据---删除状态
var util = require('../../util/util.js');
var initdata = function (that) {
  var list = that.data.list
  for (var i = 0; i < list.length; i++) {
    list[i].shows = ""
  }
  that.setData({
    list: list
  })
}
var app = new getApp();

Page({
  data: {
    delBtnWidth: 185, //删除按钮宽度单位（rpx） 
    activeIndex: 6,
    index: 0,
    // list数据
    list: '',
    current:1
  },

  // 初始化加载
  onLoad: function () {
    var that = this;
    
  },
  getExamine: function () {
    let that = this;
    wx.showLoading({
      title: '获取中...',
    })
    setTimeout(function () {
      //要延时执行的代码
    let state = that.data.activeIndex;
    wx.request({
      url: 'http://localhost:8080/Dc/myOrder/getMyOrderList',
      header: { 'content-Type': 'application/x-www-form-urlencoded' },
      method: 'POST',
      data:{
        size:10,
        current: that.data.current,
        gostate: state,
        uid: wx.getStorageSync('uid')
      },
      success: function (r) {
        if (r.data.obj.pages > 0) {
          var l = r.data.obj.records
          wx.hideLoading();
          if (l == ''){
            wx.showToast({ 
              title: '已经没有订单了',
              icon: 'success',
              duration: 2000
            })
          }
          for (var i = 0; i < r.data.obj.records.length; i++) {
            if (l[i].goState == 4) {
              l[i].goState = "已支付"
            } else {
              l[i].goState = "未支付"
            }
            l[i].goTime = util.date_time(l[i].goTime)
          }
          var moment_list = that.data.list;
          if (moment_list == ''){
            that.setData({
              list:l
            })
          }else{
            that.setData({
              list: moment_list.concat(l)
            })
          }
         
        } else {
          wx.hideLoading();
          wx.showToast({
            title: '暂无数据',
            icon: 'success',
            duration: 2000
          })
        }
      }
    })
    }, 2000) //延迟时间 这里是1秒
  },
  //顶部tab切换
  myContributeTab: function (e) {
    let that = this;
    that.setData({
      list:'',
      current:1,
      activeIndex: e.currentTarget.dataset.index,
    })
    that.getExamine()
  },

  // 开始滑动事件
  touchS: function (e) {
    if (e.touches.length == 1) {
      this.setData({
        //设置触摸起始点水平方向位置 
        startX: e.touches[0].clientX
      });
    }
  },
  touchM: function (e) {
    var that = this;
    initdata(that)
    if (e.touches.length == 1) {
      //手指移动时水平方向位置 
      var moveX = e.touches[0].clientX;
      //手指起始点位置与移动期间的差值 
      var disX = this.data.startX - moveX;
      var delBtnWidth = this.data.delBtnWidth;
      // var txtStyle = "";
      if (disX == 0 || disX < 0) { //如果移动距离小于等于0，文本层位置不变 
        // txtStyle = "left:0px";
      } else if (disX > 0) { //移动距离大于0，文本层left值等于手指移动距离 
        // txtStyle = "left:-" + disX + "px";
        if (disX >= delBtnWidth) {
          //控制手指移动距离最大值为删除按钮的宽度 
          // txtStyle = "left:-" + delBtnWidth + "px";
        }
      }

    }
  },
  // 滑动中事件
  touchE: function (e) {
    if (e.changedTouches.length == 1) {
      //手指移动结束后水平位置 
      var endX = e.changedTouches[0].clientX;
      //触摸开始与结束，手指移动的距离 
      var disX = this.data.startX - endX;
      var delBtnWidth = this.data.delBtnWidth;
      //如果距离小于删除按钮的1/2，不显示删除按钮 
      var txtStyle = "";
      txtStyle = disX > delBtnWidth / 2 ? "left:-" + delBtnWidth /2.1+ "px" : "left:0px";
      //获取手指触摸的是哪一项 
      var index = e.currentTarget.dataset.index;
      var list = this.data.list;
      list[index].shows = txtStyle;
      console.log("1", list[index].shows);
      //更新列表的状态 
      this.setData({
        list: list
      });
    } else {
      console.log("2");
    }
  },
  //获取元素自适应后的实际宽度 
  getEleWidth: function (w) {
    var real = 0;
    try {
      var res = wx.getSystemInfoSync().windowWidth;
      var scale = (750 / 2) / (w / 2);
      // console.log(scale); 
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
  //点击删除按钮事件 
  delItem: function (e) {
    var that = this;
    wx.showModal({
      title: '提示',
      content: '您确定要删除嘛',
      success (res){
        if(res.confirm){
          console.log(JSON.stringify(e.currentTarget.dataset.postid))
          wx.request({
            url: 'http://localhost:8080/Dc/myOrder/deleteMyOrderById',
            header: { "Content-Type": "application/x-www-form-urlencoded" },
            method: 'POST',
            data: {
              oid: e.currentTarget.dataset.postid
            },
            success: function (r) {
              console.log(JSON.stringify(r))
              if (r.data.status == 200) {
                wx.showToast({
                  title: '删除成功',
                  icon: 'success',
                  duration: 2000
                })
                // 获取到列表数据
                var list = that.data.list;
                // 删除
                list.splice(e.currentTarget.dataset.index, 1);
                // 重新渲染
                that.setData({
                  list: list
                })
                initdata(that)
                that.getExamine()
              } else {
                wx.showToast({
                  title: '删除失败',
                  icon: 'success',
                  duration: 2000
                })
              }
            }
          })
          // 打印出当前选中的index
          console.log(e.currentTarget.dataset.index);
        } else if (res.cancel){
            console.log("点击了取消")
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
      current: 1,
    });
    this.getExamine();
  },
 
  /**
  * 上拉加载
  */
  
  onReachBottom:function(){
    console.log("ss")
    var that = this;
    that.setData({
      current: that.data.current + 1,
    });
    that.getExamine();
  }
})
