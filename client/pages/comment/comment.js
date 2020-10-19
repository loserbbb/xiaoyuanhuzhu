// pages/comment/comment.js
var app = getApp()
const config = require('../../config.js')
const util = require('../../utils/util.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
		commentList:[],
		commentMap:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
		var that =this
		var getCommentMapSuccess=function(res){
			var commentMap = res.data
			if(typeof(commentMap)!='object'){
				return
			}
			that.data.commentMap = commentMap
			that.doRefresh()
		}
		wx.getStorage({
			key: 'commentMap',
			success: getCommentMapSuccess
		})
		// app.tunnel.on('')
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
		this.doRefresh()
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
		// wx.setStorageSync('commentMap', this.data.commentMap)
		var map = wx.getStorageSync('commentMap')
		if(typeof(map)!='object'){
			return
		}
		var commentMap = this.data.commentMap
		for(var sender in commentMap){
			map[sender] = commentMap[sender]
		}
		wx.setStorageSync('commentMap', map)
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

	doRefresh:function(){
		var that = this
		var commentList = that.data.commentList
		// var commentMap = wx.getStorageSync('commentMap')
		var commentMap = that.data.commentMap
		commentList = []
		for(var sender in commentMap){
			commentList.push(commentMap[sender])

		}
		commentList.sort((a, b) => { return new Date(b.sendTime) - new Date(a.sendTime) })
		for(var i = 0;i < commentList.length;i++){
			commentList[i].timeToNow = util.timeToNow(commentList[i].sendTime)
		}
		that.setData({
			commentList:commentList
		})
		console.log('^^^^^^^^^^^^^^^^^^^')
		console.log(commentList)
	},
	bindCommentTap:function(e){
		console.log(e)
		var sender = e.currentTarget.dataset.sender
		var assistId = e.currentTarget.dataset.assistid
		// var commentMap = wx.getStorageSync('commentMap')
		var commentMap = this.data.commentMap
		commentMap[sender].unread = false
		// wx.setStorage({
		// 	key: 'commentMap',
		// 	data: commentMap,
		// })
		console.log(assistId)
		wx.navigateTo({
			url: '/pages/details/details?assistId='+assistId,
		})
	}
})