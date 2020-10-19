var util = require('../../utils/util.js')
var config = require('../../config.js')
var app = getApp()
Page({
	data: {
		tempFilePaths: [],
		location: null,
		title: null,
		reward: null,
		discription: null,
		canSubmit:true,
		discriptionFocus:false,
		typearray:null,
		typeindex:0,
		multitask:['是','否'],
		multiindex:0,
	},
	onLoad:function(){
		this.setData({
			typearray:app.data.assistType
		})
	},
	checkCanSubmit:function(){
		var pararm = this.data
		if(typeof(pararm.title) != "string" || pararm.title.length < 3 || pararm.title.length > 15){
			console.log(5)
			return
		}
		if (typeof(pararm.reward) != "number") {
			console.log(6)
			return
		}
		if (typeof (pararm.discription) != "string" || pararm.discription.length < 3 || pararm.discription.length > 150) {
			console.log(7)
			return
		}
		if (pararm.location == null){
			console.log(8)
			return
		}
		console.log(9)
		this.setData({
			canSubmit:false
		})
	},

	chooseimage: function () {
		var _this = this;
    /*wx.showActionSheet({
      itemList: ['从相册中选择', '拍照'],
      itemColor: "#CED63A",
      success: function (res) {
        if (!res.cancel) {
          if (res.tapIndex == 0) {
            that.chooseWxImage('album')
          } else if (res.tapIndex == 1) {
            that.chooseWxImage('camera')
          }
        }
      }
    })},*/
    wx.chooseImage({
			count: 1, // 默认9 
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
						try{
							res = JSON.parse(res.data)

						}catch(e){
							util.showModel("上传失败","图片大小超过最大限制")
							return
						}
						console.log(res)
						util.showSuccess('上传图片成功')
						
						_this.data.tempFilePaths.push(res.data.imgUrl);
						_this.setData({
							tempFilePaths: _this.data.tempFilePaths
						})
					},

					fail: function (e) {
						util.showModel('上传图片失败')
					}
				})
			}
		})
	},
  /*chooseWxImage: function (type) {
    var that = this;
    wx.chooseImage({
      sizeType: ['original', 'compressed'],
      sourceType: [type],
      success: function (res) {
        console.log(res);
        that.setData({
          tempFilePaths: res.tempFilePaths[0],
        })
      }
    })
  },

*/
	delImage: function (event) {
		console.log(event)
		var index = event.target.dataset.index
		this.data.tempFilePaths.splice(index, 1)
		this.setData({
			tempFilePaths: this.data.tempFilePaths
		})
	},

	getLocation: function () {
		var that = this
		wx.getLocation({
			success: function (res) {
				that.setData({
					location: res
				})
				console.log(that.data.location)
				util.showSuccess("定位成功")
				that.checkCanSubmit()
			},
			fail: function (error) {
				util.showModel('请求失败', error)
			}
		})
	},

	formAssistSubmit: function (e) {
		var that = this
		
		var reqData = {
			publisher: app.data.userInfo.data.data.openId,
			title: this.data.title,
			reward: this.data.reward,
			discription: this.data.discription,
			picture: this.data.tempFilePaths,
			location: this.data.location,
			assistType:this.data.typearray[this.data.typeindex].id,
			multitask:this.data.multiindex,
		}
		console.log(reqData)
		wx.request({
			url: config.service.generalUrl + '/release',
			data:reqData,
			success:function(res){
				console.log(res)
				if(res.data.code == 0){
					
					that.setData({
						title: null,
						reward: null,
						discription: null,
						tempFilePaths: [],
						location: null,
						canSubmit:true
					})
					util.showSuccess("发布成功")
				}else{
					util.showModel('提交失败',res.data.data)
					console.log(res.data.data)
				}
			},
			fail:function(e){
				// util.showModel(e)
				console.log(e)
			}
		})
	},
 
	bindDescriptionTextAreaBlur: function (e) {
		this.data.discription = e.detail.value
		this.checkCanSubmit()
	},
	bindTitleInputBlur: function (e) {
		this.data.title = e.detail.value
		this.checkCanSubmit()
	},
	bindRewardInputBlur: function (e) {
	
		
		var reward = parseInt(e.detail.value)
		if (isNaN(reward)) {
			wx.showToast({
				title: '请输入数字',
			})
			this.setData({
				reward: ""
			})
			return
		}

		var coin = app.data.userBaseInfo.coin
		if (coin < reward) {
			console.log(coin+reward)
			wx.showToast({
				title: '积分不足',
			})
			this.setData({
				reward: ""
			})
			return
		}
		this.data.reward = reward
		this.checkCanSubmit()
	},
	bindDiscriptionTap:function(){
		this.setData({
			discriptionFocus:true
		})
	},
	bindPickerChange(e) {
		console.log('picker发送选择改变，携带值为', e.detail.value)
		this.setData({
			typeindex: e.detail.value
		})
	},
	bindPicker1Change(e) {
		console.log('picker发送选择改变，携带值为', e.detail.value)
		this.setData({
			multiindex: e.detail.value
		})
	},
})







