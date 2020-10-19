// pages/register/register.js
var config = require('../../config.js')
var util = require('../../utils/util.js')
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },
	formRegisterSubmit: function (e) {
		var that = this
		console.log('form发生了submit事件，携带数据为：', e.detail.value)
		const { realName, phoneNumber, sex } = e.detail.value
		if (realName.length < 2 && realName.length > 6){
			return
		}
		if(phoneNumber.length != 11){
			return
		}
		if(sex == ""){
			return
		}
		// console.log('注册')
		wx.request({
			url: config.service.generalUrl + '/register',
			data:{
				realName:realName,
				phoneNumber:phoneNumber,
				sex:sex,
				openId: app.data.userInfo.data.data.openId
			},

			success:function(res){
				console.log(res)
				if(res.data.code == 0){
		
					that.doCheckRegister()
				}else{
					util.showSuccess('注册失败')
				}
			},
			fail:function(res){
				util.showModel('请求失败', res)
				console.log('request fail', res)
			}
		})
	},

	doCheckRegister: function(){
		var that = this
		if (!app.data.userInfo.data){
			getApp().doLogin()
			return
		}
		
		wx.request({
			url: config.service.generalUrl + '/checkRegister',
			data: {
				openId: app.data.userInfo.data.data.openId

			},
			success: function (res) {
				console.log(res)
				if (res.data.code == 0) {
					app.data.userBaseInfo = res.data.data
					console.log('===============')
					console.log(app.data.userBaseInfo)
					wx.reLaunch({
						url: '/pages/index/index',
					})
				} else {
					console.log(res)
				}
			},
		})
	},
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
		// console.log('register')
		// console.log(app.data)
		this.doCheckRegister()
		
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