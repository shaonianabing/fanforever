// 获取到小程序实例
var app = getApp();
Page({
  data: {
    shop: {},
    
    goodsList: '',
    cart: {
      count: 0,
      total: 0,
      list:{}
    },
    goods: {},
    cartList: {},
    showCartDetail: false,
    classifyViewed:''
  },
  // 生命周期函数--监听页面加载
  // 一个页面只会调用一次。
  onLoad: function (options) {
    var that = this
    that.setData({
      classifyViewed: 'noodle'
    });
    that.getGoos()
    that.getShop()
    that.getCategory()
    
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function (userInfo) {
      //更新数据
      that.setData({
        userInfo: userInfo
      });
    });
  },

  getGoos:function(){
    let that = this;
    wx.request({
      url: 'http://localhost:8080/Dc/goods/getGoodsByCategoryId',
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      method: 'POST',
      data:{
        name: that.data.classifyViewed
      },
      success: function (r) {
        if (r.data.status == 200) {
         // var gd = new Array();
          console.log(r.data.obj.length)
          // for (var i = 0; i < r.data.obj.length;i++){
          //   console.log(r.data.obj[i].goodsId + ":" + r.data.obj[i])

          //   gd.push(r.data.obj[i].goodsId + ":" + r.data.obj[i])
          // }
         // console.log(JSON.stringify(gd))
          that.setData({
            goods: r.data.obj
          })
        } else {
          that.setData({
            goods: ''
          })
          wx.showToast({
            title: '该分类下没有菜品',
            icon: 'none',
            duration: 2000
          })
        }
      }
    })
  },

  getCategory:function(){
    let that = this;
    wx.request({
      url: 'http://localhost:8080/Dc/category/getCategoryByState',
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      method: 'POST',
      success: function (r) {
        if (r.data.status == 200) {
          that.setData({
            goodsList: r.data.obj
          })
        } else {
            wx.showToast({
              title: '暂无分类',
            })
        }
        
      }
    })
  },
  getShop:function(){
    let that = this;
    wx.request({
      url: 'http://localhost:8080/Dc/myShop/getMyShop',
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      method: 'POST',
      success: function (r) {
        if (r.data.status == 200) {
          if (r.data.obj.sState == 1){
            r.data.obj.sState='../../images/yy.png'
          }else{
            r.data.obj.sState = '../../images/ztyy.png'
          }
          that.setData({
            shop: r.data.obj
          })
        } else {
           
        }
      }
    })
  },
  // 生命周期函数--监听页面初次渲染完成
  onReady: function () { },
  // 生命周期函数--监听页面显示
  // 每次打开页面都会调用一次
  onShow: function () {
  
  },
  // 生命周期函数--监听页面隐藏
  // 当navigateTo或底部tab切换时调用
  onHide: function () { },
  // 生命周期函数--监听页面卸载
  // 当redirectTo或navigateBack的时候调用。
  onUnload: function () { },
  // 页面相关事件处理函数--监听用户下拉动作
  onPullDownRefresh: function () { },
  // 页面上拉触底事件的处理函数
  onReachBottom: function () { },

  // 开发者可以添加任意的函数或数据到
  //  object 参数中，在页面的函数中用 this 可以访问
  checkOrderSame: function (name) {
    var list = this.data.goods;
    for (var index in list) { 
      if (list[index].name === name) {
        return index;
      }
    }
    return false;
  },
  tapAddCart: function (e) {
    console.log(JSON.stringify(e))
    // var postId = e.currentTarget.dataset.id;
    // wx.navigateTo({
    //   url: '../Buy/Buy?id=' + postId
    // })
    //this.addCart(e.target.dataset.id);
  },
  addCart: function (e) {
    var total = e.target.dataset.id+this.data.cart.price;
    this.setData({
      total: total,
      count: this.data.cart.count++
    })
    that.getGoos()
    console.log(JSON.stringify(e))
    // var num = this.data.cart.list[id] || 0;
    // this.data.cart.list[id] = num + 1;
    // this.countCart();
  },
  countCart: function () {
    
    var count = 0,
      total = 0;
    
    for (var id in this.data.cart.list) {
      console.log(this.data.cart.list)
      console.log(this.data.goods)
      console.log(this.data.goods[id])
      var goods = this.data.goods[id];
      console.log(goods)
      count += this.data.cart.list[id];
      total += goods.goodsPrice * this.data.cart.list[id];
     
    }
    this.data.cart.count = count;
    this.data.cart.total = total;
    this.setData({
      cart: this.data.cart
    });
  },

  onGoodsScroll: function (e) {
    if (e.detail.scrollTop > 10 && !this.data.scrollDown) {
      this.setData({
        scrollDown: true
      });
    } else if (e.detail.scrollTop < 10 && this.data.scrollDown) {
      this.setData({
        scrollDown: false
      });
    }
    console.log(this.data.goods.length)
    var scale = e.detail.scrollWidth / 570,
      scrollTop = e.detail.scrollTop / scale,
      h = 0,
      classifySeleted,
      len = this.data.goods.length;
  },
  tapClassify: function (e) {
    
    var id = e.target.dataset.id;
    console.log(id)
    this.setData({
      classifyViewed: id
    });
    var self = this;
    setTimeout(function () {
      self.setData({
        classifySeleted: id
      });
    }, 100);
    this.getGoos()
  },
 
 
});