const config = require("../../config.js")
var app = getApp()
var util = require("../../utils/util.js")

Page({

  /**
   * 页面的初始数据
   */
  data: {
    assist:null,
		commentFoucs:false,
		comments:[],
		writing:true,
    commentContent:null,
    targetComment:0,
    commentType:0,
		replyTo:null,
		myHead:null,
		markers: [],
		me: {},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
		var that = this
		console.log(options)
    var assistId = options.assistId
		that.data.me = app.data.userInfo.data.data
		console.log(that.data.me)
		wx.request({
			url: config.service.generalUrl + '/getAssist',
			data: {assistId},
			success: function(res){
				if(res.data.code == 0){
					console.log(res)
					var assist = res.data.data
					assist.createTime = util.timeToNow(assist.createTime)
					assist.isSelf = assist.publisher == that.data.me.openId
					var myLocation = app.data.location
					assist.distance = util.calculateDistance(myLocation, assist.location)
					if (assist.distance < 1000) {
						assist.distance = assist.distance.toFixed(0) + 'm'
					} else {
						assist.distance = (assist.distance / 1000).toFixed(1) + 'km'
					}
					that.data.markers.push({
						iconPath: "/image/qipao.png",
						id: 0,
						latitude: assist.location.latitude,
						longitude: assist.location.longitude,
						width: 20,
						height: 20
					})
					that.setData({
						assist: assist,
						markers: that.data.markers,
						myHead: app.data.userInfo.data.data.avatarUrl
					})
					that.refreshComment()
					console.log(assist)
				}else{
					util.showModel('错误','你要找的求助不见了')
					setTimeout(function(){
						wx.navigateBack({

						})
					},2000)
					
				}
			},
			fail: function(){
				util.showModel('错误','您要看的求助不见了')
				wx.navigateBack({
					
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
  jumpSY: function () {
    wx.navigateBack({
			delta:1
		})
  },
  jumpWD: function () {
    wx.switchTab({
      url: '../me/me'
    })
  },
	bindTapComment: function(){
		this.setData({
			writing:false,
			commentFoucs:true
		})
	},
	bindBlurComment:function(e){
    console.log(e)
		// this.data.commentContent = e.detail.value
		this.setData({
			writing:true,
		})
    if(e.detail.value == ""){
      this.setData({
        commentType:0,
				targetComment:0,
				replyTo:null,
      })
    }
	},
  submitComment:function(e){
    var that = this
    console.log(this.data.commentContent)
    var data = {
      openId: app.data.userInfo.data.data.openId,
      commentType: that.data.commentType,
      assistId: that.data.assist.assistId,
      targetComment: that.data.targetComment,
      content: e.detail.value.commentContent
    }
		console.log('提交的数据')
    console.log(data)
    wx.request({
      url: config.service.generalUrl + '/setComment',
      data:data,
      success:function(res){
        console.log(res)
        util.showSuccess("留言成功")
        that.setData({
          commentContent:"",
          commentType:0,
					replyTo:null,
					targetComment:0
        })
				that.refreshComment()
      },
      fail:function(error){
        console.log(error)
        util.showModel("留言失败",error)
      }
    })
  },

  refreshComment:function(){
		var that = this
    wx.request({
      url: config.service.generalUrl + "/getComments",
			data:{
				assistId:that.data.assist.assistId
			},
      success: function (res) {
				that.data.comments = []
				var comments = res.data.data
				console.log(comments)
				for(var i = 0;i < comments.length;i++){
					comments[i].createTime = new Date(comments[i].createTime)
				}
				comments.sort(function(a,b){return b.createTime - a.createTime})
				console.log('排序')
				console.log(comments)
				for(var i = 0;i < comments.length;i++){
					var comment = comments[i]
					comment.dtime = util.timeToNow(comment.createTime)
					comment.reply = []
					if(comment.commentType == 0){
						that.data.comments.push(comment)
					}
				}
				var findReply = function(replys,target){
					for(var i = 0;i < comments.length;i++){
						if(comments[i].commentType == 1 && comments[i].targetComment == target.commentId){
							comments[i].targetName = target.userInfo.nickName
							replys.push(comments[i])
							findReply(replys,comments[i])
						}
					}
				}

				for(var i = 0;i < that.data.comments.length;i++){
					findReply(that.data.comments[i].reply, that.data.comments[i])
					that.data.comments[i].reply.sort(function (a, b) { return b.createTime - a.createTime })
				}
				console.log(that.data.comments)
				that.setData({
					comments:that.data.comments
				})

      },
    })
  },

	bindReplyTap:function(e){
		console.log(e)
		this.setData({
			commentFoucs:true,
			writing:false,
			replyTo:e.currentTarget.dataset,
			targetComment:e.currentTarget.dataset.targetreply,
			commentType:1
		})
  },

  tiao: function () {
		var para = 'openId='+this.data.assist.userInfo.openId
    wx.navigateTo({
      url: '../chatRoom/chatRoom?'+para
    })
  },

	offerHelp:function(){
		var that = this
		wx.request({
			url: config.service.generalUrl + '/offerHelp',
			data: {
				openId:app.data.userInfo.data.data.openId,
				assistId:that.data.assist.assistId
			},
			success:function(res){
				console.log(res)
				if(res.data.code == 0){
					util.showModel('申请成功','请联系对方')
					that.data.assist.status = 1
					that.setData({
						assist: that.data.assist
					})
				}
			}
		})
	},
	
	cancelAssist:function(){
		var that = this
		wx.request({
			url: config.service.generalUrl + '/delAssist',
			data:{
				assistId:that.data.assist.assistId
			},
			success:function(res){
				if(res.data.code == 0){
					util.showSuccess('取消成功')
					wx.navigateBack({
					})
				}else{
					util.showModel('取消失败',res.data.data)
				}
			}
		})
	},
	confirm:function(){
		var that = this
		wx.request({
			url: config.service.generalUrl + '/achieveAssist',
			data: {
				assistId: that.data.assist.assistId
			},
			success: function (res) {
				if (res.data.code == 0) {
					util.showSuccess('已确认完成')
					setTimeout(function(){
						wx.navigateBack({
						})
					},2000)
					
				} else {
					util.showModel('操作失败失败', res.data)
				}
			}
		})
	},
	previewImage: function (e) {
		var current = e.target.dataset.src;
		wx.previewImage({
			current: current, // 当前显示图片的http链接  
			urls: this.data.assist.picture // 需要预览的图片http链接列表  
		})
	}
})


