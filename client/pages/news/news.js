var app = getApp()
const util = require('../../utils/util.js')
const config = require('../../config.js')
Page({

  /**
   * 页面的初始数据
   */
	data: {
		chatMap: {},
		chatList: [],
		sendersInfo: {},
		newComment:false,
		ok:false,
	},

  /**
   * 生命周期函数--监听页面加载
   */
	onLoad: function (options) {

		var that = this
		var getUnreadMapSuccess = function (res) {
			console.log('获取unread成功')
			console.log(res.data)
			var map = res.data
			that.addToMap(Object.keys(map), that.doRefresh)
		}
		var getUnreadMapFail = function(error){
			that.addToMap([], that.doRefresh)
		}
	
		var chatMap = wx.getStorageSync('chatMap')
		if (typeof (chatMap) == 'object') {
			that.data.chatMap = chatMap
		}
		console.log('获取本地chatmap')
		console.log(chatMap)

		wx.getStorage({
			key: 'unreadMap',
			success: getUnreadMapSuccess,
			fail: getUnreadMapFail,
		})
	},


	doRefresh() {
		var that = this
		that.data.chatMap = wx.getStorageSync('chatMap')
		var chatMap = that.data.chatMap

		var chatList = that.data.chatList
		//
		// for(var sender in chatMap){
		// 	var spk = wx.getStorageSync('spk' + newSenders[i])
		// 	chatMap[sender] = spk[spk.length - 1]
		// }
		// //

		var getUnreadSuccess = function (res) {
			var unreadMap = res.data
			chatList = []
			console.log('unreadMap')
			console.log(unreadMap)
			for (var sender in chatMap) {
				if (unreadMap[sender]) {
					chatMap[sender].unread = true
				} else {
					chatMap[sender].unread = false
				}
				chatMap[sender].timeToNow = util.timeToNow(chatMap[sender].sendTime)
				chatList.push(chatMap[sender])
			}
			chatList.sort((a, b) => { return new Date(b.sendTime) - new Date(a.sendTime) })
			that.setData({
				chatList: chatList,
				ok:true
			})
			console.log(chatList)
			console.log('刷新了')

		}
		var getCommentMapSuccess = function(res){
			var commentMap = res.data
			var newComment = false
			for(var sender in commentMap){
				if(commentMap[sender].unread){
					newComment = true
					break
				}
			}
			that.setData({
				newComment:newComment
			})
		}
		wx.getStorage({
			key: 'unreadMap',
			success: getUnreadSuccess,
		})
		wx.getStorage({
			key: 'commentMap',
			success: getCommentMapSuccess
		})
	},

	modifyChatMap:function(sender,speak){
		var setMap=function(map){
			wx.setStorage({
				key: 'chatMap',
				data: map,
			})
		}
		wx.getStorage({
			key: 'chatMap',
			success: function(res) {
				var map = res.data
				map[sender] = speak
				setMap(map)
			},
			fail:function(error){
				var map = {}
				map[sender] = speak
				setMap(map)
			}
		})
	},
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
	onReady: function () {
		var that = this
		var chatMap = that.data.chatMap
		var userInfo = {}
		app.tunnel.on('speak', speak => {

			console.log('speak')
			var getUserInfoSuccess = function(res){
				var userInfo = res.data.data.userInfo
				speak.nickName = userInfo.nickName
				speak.avatarUrl = userInfo.avatarUrl
				chatMap[speak.sender] = speak
				modifyChatMap(speak.sender,speak)
				console.log(that.data.chatMap)
				console.log(chatMap)
				// console.log('刷新了')
				that.doRefresh()
			}
			// speak.unread = true
			var doRequest = function(){
				wx.request({
					url: config.service.generalUrl + '/getUserInfo',
					data: {
						openId: speak.sender
					},
					success: getUserInfoSuccess,
				})
			}
			

			wx.getStorage({
				key: 'unreadMap',
				success: function(res) {
					var unread = res.data
					unread[speak.sender] = true
					wx.setStorage({
						key: 'unreadMap',
						data: unread,
						success: function(res){
							doRequest()
						}
					})
				},
			})
		})
	},

	bindChatTap: function (e) {
		console.log(e)
		var openId = e.currentTarget.dataset.sender

		wx.navigateTo({
			url: '/pages/chatRoom/chatRoom?openId=' + openId,
		})
	},

	bindCommentTap: function(){
		wx.navigateTo({
			url: '/pages/comment/comment',
		})
	},
  /**
   * 生命周期函数--监听页面显示
   */
	onShow: function () {
		// if(this.data.ok){
			this.doRefresh()
		// }
		
	},

	addToMap(newSenders, callback) {
		var that = this
		var chatMap = that.data.chatMap

		var getUsersInfoSuccess = function (res) {
			var Infos = res.data.data
			for (var i = 0;i < newSenders.length;i++) {
				var spk = wx.getStorageSync('spk' + newSenders[i])
			
				chatMap[newSenders[i]] = spk[spk.length - 1]
			}
			for (var i = 0; i < Infos.length; i++) {
				chatMap[Infos[i].userInfo.openId].nickName = Infos[i].userInfo.nickName
				chatMap[Infos[i].userInfo.openId].avatarUrl = Infos[i].userInfo.avatarUrl
			}
			wx.setStorageSync('chatMap', chatMap)
			callback()
		}
		wx.request({
			url: config.service.generalUrl + '/getUsersInfo',
			data: {
				senders: newSenders
			},
			success: getUsersInfoSuccess
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
		// var that = this
		// wx.setStorage({
		// 	key: 'chatMap',
		// 	data: that.data.chatMap,
		// })
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