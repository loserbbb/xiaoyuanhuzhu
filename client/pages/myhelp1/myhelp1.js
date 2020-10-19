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
			status: 1
		}
		wx.request({
			url: config.service.generalUrl + '/getMyHelp',
			data: data,
			success: function (res) {

				if (res.data.code == 0) {
					console.log('😄？')
					var reslist = res.data.data
					reslist.sort(function (a, b) { return new Date(b.createTime) - new Date(a.createTime) })
					for (var i = 0; i < reslist.length; i++) {
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

	bindDelTap: function (e) {
		var that = this
		var assistId = e.currentTarget.dataset.assistid
		wx.request({
			url: config.service.generalUrl + '/delHistory',
			data: {
				assistId: assistId
			},
			success: function (res) {
				if (res.data.code == 0) {
					util.showSuccess('删除成功')
					that.refreshList()
				} else {
					util.showModel('操作失败', res.data.data)
				}
			},
		})
	},
	bindAssistTap: function (e) {
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
