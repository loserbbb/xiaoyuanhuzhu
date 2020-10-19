var app = getApp()
// pages/me/me.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    realName: "",
    coin: null,
    experience: null,
    sex: "",
    userInfo: {
      avatarUrl: "",//用户头像  
    }


  },
  add_address_fun: function () {
    wx.navigateTo({
      url: 'add_address/add_address',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
		console.log('me 已加载')
    var that = this;
    wx.getUserInfo({
      success: function (res) {
        console.log(res);
        var avatarUrl = 'userInfo.avatarUrl';
        var userBaseInfo = app.data.userBaseInfo;
        that.setData({
          [avatarUrl]: res.userInfo.avatarUrl,
          realName: userBaseInfo.realName,
          coin: userBaseInfo.coin,
          experience: userBaseInfo.experience,
          sex: userBaseInfo.sex,
        })
      }
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
		var userBaseInfo = app.data.userBaseInfo;
		this.setData({
			realName: userBaseInfo.realName,
			coin: userBaseInfo.coin,
			experience: userBaseInfo.experience,
			sex: userBaseInfo.sex,
		})
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

  },
  toast: function () {
    wx.navigateTo({
      url: '../myaid1/myaid1'
    })
  },
  toast1: function () {
    wx.navigateTo({
      url: '../myaid0/myaid0'
    })
  },
  toast2: function () {
    wx.navigateTo({
      url: '../myhelp1/myhelp1'
    })
  },
  toast3: function () {
    wx.navigateTo({
      url: '../myhelp0/myhelp0'
    })
  },
  integral: function () {
    wx.navigateTo({
      url: '../integral/integral'
    })
  },
  message: function () {
    wx.navigateTo({
      url: '../message/message'
    })
  }

})