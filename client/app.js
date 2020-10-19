//app.js
var qcloud = require('./vendor/wafer2-client-sdk/index')
var config = require('./config')
var util = require('./utils/util.js')

App({
	data: {
		userInfo: {},
		logged: false,
		userBaseInfo: {},
		location: null,
		assistType:[],
	},
	onLaunch: function () {
		this.getAssistType()
		qcloud.setLoginUrl(config.service.loginUrl)
	},




	bindGetUserInfo: function (e) {
		// if (this.data.logged) return;

		util.showBusy('正在登录');

		var that = this;
		console.log(e)
		// 查看是否授权
		wx.getSetting({
			success: function (res) {
				if (res.authSetting['scope.userInfo']) {
					qcloud.clearSession();
					// 登录态已过期，需重新登录
					var options = {
						encryptedData: e.detail.encryptedData,
						iv: e.detail.iv,
						userInfo: e.detail.userInfo
					}
					
					that.doLogin();
				} else {
					util.showModel('用户未授权', e.detail.errMsg);
				}
			}
		});
	},
	doLogin: function () {
		// if (this.data.logged) return

		util.showBusy('正在登录')
		var that = this

		// 调用登录接口
		qcloud.login({
			success(result) {

				// 如果不是首次登录，不会返回用户信息，请求用户信息接口获取
				qcloud.request({
					url: config.service.requestUrl,
					login: true,
					success(result) {
						util.showSuccess('登录成功')
						that.data.userInfo = result
						console.log(result)
						that.data.logged = true
						wx.redirectTo({
							url: '/pages/register/register',
						})

					},
					fail(error) {
						util.showModel('请求失败', error)
						console.log('request fail', error)
					}
				})

			},
			fail(error) {
				util.showModel('登录失败', error)
				console.log('登录失败', error)
			}
		})
	},
	getAssistType: function () {
		var that = this;
		wx.request({
			url: config.service.generalUrl + '/getAssistType',
			data: {
			},
			success: function (res) {
				console.log('++++++++++++')
				console.log(res)
				if (res.data.code == 0) {
					// that.data.assistType.push({ id: -1, type: '综合' });
					that.data.assistType = res.data.data;
					
					// that.data.assistType = that.data.assistType.concat(res.data.data);
				}
			}
		})
	}, 
})