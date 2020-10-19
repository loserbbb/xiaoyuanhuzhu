// client/pages/setLocation/setLocation.js
var app = getApp();
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		location:null,
		markers:[],
		circles:[],
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		var location = app.data.location;
		this.setData({
			location:location,
			markers: [{
				latitude: location.latitude,
				longitude: location.longitude,
				iconPath: '../../image/locationcenter.png',
				width: 20,
				height: 20,
			}],
			circles: [{
				latitude: location.latitude,
				longitude: location.longitude,
				color: '#FF0000DD',
				fillColor: '#d1edff88',
				radius: 300,//定位点半径
				strokeWidth: 1
			}],
		})
		console.log(this.data.location)
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

	},
	bindMapTap:function(e){
		console.log(e)
	},
	my_location: function (e) {
		var that = this;
		that.onLoad();
	},
	regionchange(e) {
		// 地图发生变化的时候，获取中间点，也就是用户选择的位置toFixed
		if (e.type == 'end' && (e.causedBy == 'scale' || e.causedBy == 'drag')) {
			console.log(e)
			var that = this;
			this.mapCtx = wx.createMapContext("map4select");
			this.mapCtx.getCenterLocation({
				type: 'gcj02',
				success: function (res) {
					that.setData({
						location:{
							latitude: res.latitude,
							longitude: res.longitude,
						},
						circles: [{
							latitude: res.latitude,
							longitude: res.longitude,
							color: '#FF0000DD',
							fillColor: '#d1edff88',
							radius: 300,//定位点半径
							strokeWidth: 1
						}]
					})
				}
			})
		}
	},
	submitLocation(){
		app.data.location.latitude = this.data.location.latitude;
		app.data.location.longitude = this.data.location.longitude;
		wx.navigateBack({
			
		})
	}
})