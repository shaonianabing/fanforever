//var postsData = require('../../data/posts-data.js')

// 获取全局应用程序实例对象
var app = getApp();

// 创建页面实例对象
Page({
  name: "index",
  data: {
    current:1,
    posts_key:''
  },

  onLoad:function (options) {
    var that = this
    //调用应用实例的方法获取全局数据
    that.getGoodsList();
    that.upUserTime();
  },
  dj: function () {
    wx.showToast({
      title: '敬请期待',
      icon:'none',
      duration:1000
    })
  },

  upUserTime:function(){
    let uid = wx.getStorageSync('uid');
    if ("" != uid) {
    wx.request({
      url: 'http://localhost:8080/Dc/xuser/setUserLoginTime',
      header: { 'content-Type': 'application/x-www-form-urlencoded' },
      method: 'POST',
      data: {
        id: uid,
      },
      success: function (r) {
        if (r.data == 200) {
          
        } else {
          
        }
      }
    })
    } else {
      
    }
  },
  getGoodsList :function(){
    let that = this;
    wx.showLoading({
      title: '努力加载中...',
    })
    setTimeout(function () {
      wx.request({
        url: 'http://localhost:8080/Dc/goods/getSGoods',
        header: { 'content-Type': 'application/x-www-form-urlencoded' },
        method: 'POST',
        data: {
          size: 8,
          current: that.data.current
        },
        success: function (r) {
          if (r.data.obj.pages > 0) {
            console.log(r.data.obj.records)
            if (r.data.obj.records == ''){
              wx.showToast({
                title: '已经没有数据',
                icon: 'success',
                duration: 2000
              })
            }
            wx.hideLoading();
            //更新数据
            var moment_list = that.data.posts_key;
            if (moment_list == '') {
              that.setData({
                posts_key: r.data.obj.records
              })
              
            } else {
              that.setData({
                posts_key: moment_list.concat(r.data.obj.records)
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
      wx.hideLoading();
    }, 2000)  
  },
  onReady: function () {
    // 生命周期函数--监听页面初次渲染完成
    var that = this
    that.checksession();
  },
  checksession: function () {
    wx.checkSession({
     
      success: function (res) {
        console.log(res, '登录未过期')
        
      },
      fail: function (res) {
        console.log(res, '登录过期了')
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
    })
  },
   

  //以下为自定义点击事件
  menuTap: function (event) {
    //event(系统给的一个框架)、currentTarget(当前鼠标点击的一个组件)、dataset(所有自定义数据的集合)、  .（变量名）
    var postId = event.currentTarget.dataset.postid;
    wx.navigateTo({
      url: '../Buy/Buy?id=' + postId
    })
  },
  /**
   * 上拉加载
   */
 
  onReachBottom: function () {
    console.log("ss")
    var that = this;
    that.setData({
      current: that.data.current + 1,
    });
    that.getGoodsList();
  },

  //显示隐藏商品详情弹窗
  showGoodsDetail: function (e) {
    this.setData({
      showGoodsDetail: this.data.showGoodsDetail,
      id: e.target.dataset.id
    });
  },

  hideGoodsDetail: function () {
    this.setData({
      showGoodsDetail: false
    });
  },

  closeTap: function () {
    this.setData({
      showGoodsDetail: true
    });
  },

  // 店铺选择弹出框
  select_chooseFailureList: function (event) {
    // 事件中获取到店铺rid
    var ChooseFailureid = event.target.dataset.id; //rid
    var sub_index = event.target.dataset.sub_index;
    // 事件中获取到符合条件的门店
    var num = event.target.dataset.num;
    // 事件中获取到符合条件的店铺名
    var text = event.target.dataset.text;
    // 事件中获取到备注
    var remark = event.target.dataset.remark;

    //查找符合条件的店铺rid放到临时数组里面
    var ridTemp = [];
    var ridList = this.data.ridList;
    for (var i = 0, len = ridList.length; i < len; i++) {
      if (sub_index == ridList[i].sub_index) {
        ridTemp.push(ridList[i]);
      }
    }
    //查询选择rid对应有没有选中过rid详情
    var chooseFailureList = this.data.chooseFailureList;
    
    // 获取到已开店所有的rid
    var open = chooseFailureList[num].open;
    // console.log(oepn)
    // 遍历出开店状态的店铺rid
    if ( open==1 && rid!==null ) {
      for (var j = 0; j < ridTemp.length; j++) {
        if (j == select_index) {
          ridTemp[j].class = true;
          ridTemp[j].ChooseFailureid = ChooseFailureid;
        }
        else {
           ridTemp[j].class = false;
           ridTemp[j].ChooseFailureid = ChooseFailureid;
        }
      }
    } else {
      for (var j = 0; j < ridTemp.length; j++) {
         ridTemp[j].class = false;
         ridTemp[j].ChooseFailureid = ChooseFailureid;
      }
    }
  },

  getEat:function (){
    wx.navigateTo({
      url: '../me/me',
    })
  }
  
})

