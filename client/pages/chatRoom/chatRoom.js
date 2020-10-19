var app = getApp()
const util = require('../../utils/util.js')
const config = require('../../config.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    other:null,
		me:null,
		msgList:[],
		inputContent:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
		var that = this
    console.log(options)
		wx.request({
			url: config.service.generalUrl + '/getUserInfo',
			data:{
				openId:options.openId
			},
			success:function(res){
				console.log(res)
				wx.getStorage({
					key: 'spk' + options.openId,
					success: function(res) {
						if(res != ''){
							console.log(res)
							that.setData({
								msgList : res.data
							})
							that.pageScrollToBottom()
						}
					},
					fail:function(error){
						console.log('没有获取到信息')
					}
				})
				that.setData({
					other:res.data.data.userInfo,
					me: app.data.userInfo.data.data
				})
				wx.setNavigationBarTitle({
					title: res.data.data.userInfo.nickName
				})
			}
		})

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
	  var that = this
		app.tunnel.on('speak', speak => {
			// console.log(speak)
			const currentPages = getCurrentPages()
			if(currentPages[currentPages.length - 1] === this){
				console.log('可以到这里')
				console.log(speak)
				console.log(that.data.other)
				if (speak.sender == that.data.other.openId) {
					speak.who = 1
					that.data.msgList.push(speak)
					that.setData({
						msgList: that.data.msgList
					})
					that.pageScrollToBottom()
				}
			}
		})
  },
	pageScrollToBottom: function () {
		wx.createSelectorQuery().select('#chatRoom').boundingClientRect(function (rect) {
			// 使页面滚动到底部
			wx.pageScrollTo({
				scrollTop: rect.bottom
			})
		}).exec()
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
		var that = this
		wx.getStorage({
			key: 'unreadMap',
			success: function (res) {
				var map = res.data
				delete map[that.data.other.openId]
				console.log('删除unreadMap')
				console.log(that.data.other.openId)
				console.log(map)
				wx.setStorage({
					key: 'unreadMap',
					data: map,
				})
			},
		})
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
		var that = this

		var map = wx.getStorageSync('unreadMap')
		if(map == ''){ map = {}}
		delete map[that.data.other.openId]
		console.log('删除unreadMap')
		console.log(that.data.other.openId)
		console.log(map)
		wx.setStorageSync('unreadMap', map)
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

	bindInputMessage:function(e){
		this.data.inputContent = e.detail.value
	},
	bindSendMessage:function(){
		if (this.data.inputContent == '') {
			return
		}
		this.sendMessage(this.data.inputContent,0)
	},
	sendMessage(word,msgType) {
		var that = this
		// if (that.data.inputContent == ''){
		// 	return
		// }
		console.log('消息为')
		console.log(this.data.inputContent)
		if (!app.tunnelStatus || !app.tunnelStatus === 'connected') return
		// 使用 tunnel.isActive() 来检测当前信道是否处于可用状态
		if (app.tunnel && app.tunnel.isActive()) {
			// 使用信道给服务器推送「speak」消息
			var msg = {
				'word': word,
				'receiver': this.data.other.openId,
				'sendTime': util.getNowFormatDate(new Date()),
				'msgType': msgType
			}
			app.tunnel.emit('speak',msg);
			msg.who = 0
			that.data.msgList.push(msg)
			that.setData({
				msgList:that.data.msgList,
				inputContent:''
			})

			that.pageScrollToBottom()
			var setMySpk = function(spk){
				wx.setStorage({
					key: 'spk' + that.data.other.openId,
					data: spk,
				})
			}
			wx.getStorage({
				key: 'spk'+ that.data.other.openId,
				success: function(res) {
					var list = res.data
					list.push(msg)
					setMySpk(list)
				},
				fail: function(error) {
					var data = []
					data.push(msg)
					setMySpk(data)
				}
			})
			var setChatMap = function(map){
				var newMsg = {
					sender:msg.receiver,
					word:msg.word,
					sendTime:msg.sendTime,
					msgType:msg.msgType,
					who:0,
					nickName:that.data.other.nickName,
					avatarUrl:that.data.other.avatarUrl,
					unread:false
				}
				map[msg.receiver] = newMsg
				wx.setStorage({
					key: 'chatMap',
					data: map,
				})

			}
			wx.getStorage({
				key: 'chatMap',
				success: function(res) {
					var map = res.data
					setChatMap(map)
				},
				fail:function(error){
					var map = {}
					setChatMap(map)
				}
			})
			console.log('已发送')
		}
	},

	bindSendImg: function () {
		var _this = this;

		wx.chooseImage({
			count: 3, // 默认9 
			sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有 
			sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有 

			success: function (res) {
				// 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片 
				util.showBusy('正在上传')
				var filePath = res.tempFilePaths[0]

				// 上传图片
				wx.uploadFile({
					url: config.service.uploadUrl,
					filePath: filePath,
					name: 'file',

					success: function (res) {

						console.log(res)
						try {
							res = JSON.parse(res.data)

						} catch (e) {
							util.showModel("上传失败", "图片大小超过最大限制")
							return
						}
						console.log(res)
						// util.showSuccess('上传图片成功')
						_this.sendMessage(res.data.imgUrl,1)
						// _this.data.tempFilePaths.push(res.data.imgUrl);
						// _this.setData({
						// 	tempFilePaths: _this.data.tempFilePaths
						// })
					},

					fail: function (e) {
						util.showModel('上传图片失败')
					}
				})
			}
		})
	},
	previewImage: function (e) {
		var current = e.target.dataset.src;
		wx.previewImage({
			current: current, // 当前显示图片的http链接  
			urls: [current] // 需要预览的图片http链接列表  
		})
	}   
})