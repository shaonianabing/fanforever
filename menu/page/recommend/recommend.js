Page({

  /**
   * 页面的初始数据
   */
  data: {
    classify:'',
    current:1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getRecommend();
  },
  getRecommend: function () {
    let that = this;
    wx.showLoading({
      title: '努力加载中...',
    })
    setTimeout(function () {
      wx.request({
        url: 'http://localhost:8080/Dc/goods/getRecommendList',
        header: { 'content-Type': 'application/x-www-form-urlencoded' },
        method: 'POST',
        data: {
          size: 8,
          current: that.data.current
        },
        success: function (r) {
          if (r.data.obj.pages > 0) {
            console.log(r.data.obj.records)
            that.setData({
              classify: r.data.obj.records
            })
          } else {
            wx.hideLoading();
            wx.showToast({
              title: '暂无今日推荐',
              icon: 'none',
              duration: 2000
            })
          }
        }
      })
      wx.hideLoading();
    }, 2000)
  },

  menuTap: function (event) {
    //event(系统给的一个框架)、currentTarget(当前鼠标点击的一个组件)、dataset(所有自定义数据的集合)、  .（变量名）
    var postId = event.currentTarget.dataset.postid;
    wx.navigateTo({
      url: '../Buy/Buy?id=' + postId
    })
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