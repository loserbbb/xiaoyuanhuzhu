var app = getApp()
const config = require('../../config.js')
const util = require('../../utils/util.js')
Page({
	data: {
		assists: []
	},
	onLoad: function () {
		this.refreshList()
	},

	refreshList: function () {
		var that = this
		var data = {
			openId: app.data.userInfo.data.data.openId,
			status: 0
		}
		wx.request({
			url: config.service.generalUrl + '/getMyAssist',
			data: data,
			success: function (res) {

				if (res.data.code == 0) {

					var reslist = res.data.data
					reslist.sort(function (a, b) { return new Date(b.createTime) - new Date(a.createTime) })
					for(var i = 0;i < reslist.length;i++){
						reslist[i].time = util.getNowFormatDate(new Date(reslist[i].createTime))
					}
					that.setData({
						assists: reslist
					})
					console.log(that.data.assists)

				} else {
					util.showModel('请求失败', res.data.data)
				}
			}
		})
	},





	bindChatTap: function (e) {
		// console.log(222222222222)
		var openId = e.currentTarget.dataset.openid
		wx.navigateTo({
			url: '/pages/chatRoom/chatRoom?openId=' + openId,
		})
	},
	bindAchieveTap: function (e) {
		// console.log(333333333333)
		var that = this
		var assistId = e.currentTarget.dataset.assistid
		wx.request({
			url: config.service.generalUrl + '/achieveAssist',
			data: {
				assistId: assistId
			},
			success: function (res) {
				if (res.data.code == 0) {
					util.showSuccess('已确认完成')
					that.refreshList()
				} else {
					util.showModel('操作失败', res)
				}
			},
			fail:function(error){
				util.showModel('请求失败',JSON.stringify(error))
			}
		})
	},
	bindCancelTap: function (e) {
		// console.log(4444444444444)
		var that = this
		var assistId = e.currentTarget.dataset.assistid
		wx.request({
			url: config.service.generalUrl + '/delAssist',
			data: {
				assistId: assistId
			},
			success: function (res) {
				if (res.data.code == 0) {
					util.showSuccess('取消成功')
					that.refreshList()
				} else {
					util.showModel('操作失败', res.data.data)
				}
			}
		})
	},
	bindAssistTap:function(e){
		// console.log(555555555555555)
		var assistId = e.currentTarget.dataset.assistid
		console.log(assistId)
		// wx.navigateTo({
		// 	url: '/pages/details/details?assistId=' + assistId,
		// })
		var url = '/pages/details/details?assistId=' + assistId

		wx.redirectTo({
			url: url,
		})
	}

})
