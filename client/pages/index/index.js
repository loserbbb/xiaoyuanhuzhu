// pages/index/index.js
var config = require("../../config.js")
var qcloud = require('../../vendor/wafer2-client-sdk/index')
var app = getApp()
var util = require("../../utils/util.js")
const s = 1000
const m = s * 60
const h = m * 60
const d = h * 24
const mo = d * 30
const y = mo * 12

Page({

  /**
   * 页面的初始数据
   */
  data: {
    located: false,
    assists: [],
    precision: 4,
    assistIdMap: {},
    menuTapCurrent: 0,
    formattedAddress: '',
    newMsg: false,
    assistType: [],
    typeindex: 0,
  },
  menuTap: function(e) {
    var current = parseInt(e.currentTarget.dataset.current); //获取到绑定的数据
    //改变menuTapCurrent的值为当前选中的menu所绑定的数据
    if (current != this.data.menuTapCurrent) {
      this.setData({
        menuTapCurrent: current
      });
      this.data.assists = []
      this.data.assistIdMap = {}
      this.getAssists(current)
    }

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this
    this.openTunnel()
    that.data.assistType.push({
      id: -1,
      type: '综合'
    });
    that.data.assistType = that.data.assistType.concat(app.data.assistType);
    that.setData({
      assistType: that.data.assistType
    })
    wx.getLocation({
      success: function(res) {
        app.data.location = res
        console.log(res)
        that.setData({
          located: true
        })

        that.getAssists()
        // that.getAssistType()
        that.getRelLocation()

      },
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    var that = this
    that.setData({
      newMsg: false
    })

    wx.getStorage({
      key: 'unreadMap',
      success: function(res) {
        if (Object.keys(res.data).length > 0) {
          that.setData({
            newMsg: true
          })
        }
      },
    })
    wx.getStorage({
      key: 'commentMap',
      success: function(res) {
        var commentMap = res.data
        var newComment = false
        for (var sender in commentMap) {
          if (commentMap[sender].unread) {
            newComment = true
            break
          }
        }
        that.setData({
          newMsg: newComment
        })

      },
    })
    that.data.assists = []
    that.data.assistIdMap = {}
    that.getAssists(that.data.menuTapCurrent)
    if (app.data.location) {
      that.getRelLocation()
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    // util.showSuccess("刷新")
    var that = this
    that.data.assists = []
    that.data.assistIdMap = {}
    that.data.precision = 4
    that.getAssists()
    wx.stopPullDownRefresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },

  getAssists: function(order = 0) {
    var that = this
    wx.request({
      url: config.service.generalUrl + '/getAssists',
      data: {
        openId: app.data.userInfo.data.data.openId,
        location: app.data.location,
        precision: that.data.precision,
        assistType: that.data.assistType[that.data.typeindex].id
      },
      success: function(res) {

        console.log(res)
        if (res.data.code == 0) {
          var assists = res.data.data
          var myLocation = app.data.location
          var assistIdMap = that.data.assistIdMap


          for (var i = 0; i < assists.length; i++) {

            var assist = assists[i]
            assist.distance = util.calculateDistance(myLocation, assist.location)
          }
          if (order == 0) {
            //排序1

            assists.sort(function(a, b) {
              return new Date(b.createTime) - new Date(a.createTime)
            })
          } else {
            //排序2

            assists.sort(function(a, b) {
              return a.distance - b.distance
            })
          }



          for (var i = 0; i < assists.length; i++) {
            var assist = assists[i]
            if (assistIdMap[assist.assistId] != null) {
              continue
            }
            assistIdMap[assist.assistId] = true
            if (assist.distance < 1000) {
              assist.distance = assist.distance.toFixed(0) + 'm'
            } else {
              assist.distance = (assist.distance / 1000).toFixed(1) + 'km'
            }

            assist.createTime = util.timeToNow(assist.createTime)
            that.data.assists.push(assist)
          }
          that.setData({
            assists: that.data.assists
          })
          console.log(that.data.assists)
        }

      },
      fail: function(error) {
        console.log("获取附近帮助信息失败：" + error)
      }
    })
  },
  switchDetails: function(event) {
    var index = event.currentTarget.dataset.index
    var assist = this.data.assists[index]

    console.log(assist)
    wx.navigateTo({
      url: '/pages/details/details?assistId=' + assist.assistId,
    })
  },
  toast3: function() {
    wx.navigateTo({
      url: '../news/news'
    })
  },

  openTunnel: function() {
    var that = this
    util.showBusy('信道连接中...')
    // 创建信道，需要给定后台服务地址
    var tunnel = app.tunnel = new qcloud.Tunnel(config.service.tunnelUrl)

    // 监听信道内置消息，包括 connect/close/reconnecting/reconnect/error
    tunnel.on('connect', () => {
      util.showSuccess('信道已连接')
      console.log('WebSocket 信道已连接')
      //this.setData({ tunnelStatus: 'connected' })
      app.tunnelStatus = 'connected'
    })

    tunnel.on('close', () => {
      util.showSuccess('信道已断开')
      console.log('WebSocket 信道已断开')
      //this.setData({ tunnelStatus: 'closed' })
      app.tunnelStatus = 'closed'
    })

    tunnel.on('reconnecting', () => {
      console.log('WebSocket 信道正在重连...')
      util.showBusy('正在重连')
    })

    tunnel.on('reconnect', () => {
      console.log('WebSocket 信道重连成功')
      util.showSuccess('重连成功')
    })

    tunnel.on('error', error => {
      util.showModel('信道发生错误', error)
      console.error('信道发生错误：', error)
    })
    tunnel.on('coinPush', data => {
      console.log('coin来了')
      if (data.coin) {
        app.data.userBaseInfo.coin = data.coin
      } else {
        wx.request({
          url: config.service.generalUrl + '/getCoin',
          data: {
            openId: app.data.userInfo.data.data.openId
          },
          success: function(res) {
            if (res.data.code == 0) {
              app.data.userBaseInfo.coin = res.data.data.coin
            }
          }
        })
      }
    })


    // 监听自定义消息（服务器进行推送）
    app.tunnel.on('speak', speak => {
      this.setData({
        newMsg: true
      })
      console.log('有人发消息了')
      console.log(speak)
      speak.who = 1
      //先获取消息队列
      wx.getStorage({
        key: 'spk' + speak.sender,

        success: function(res) {
          res.data.push(speak)

          //存入消息队列
          wx.setStorage({
            key: 'spk' + speak.sender,
            data: res.data,
            success: function() {
              app.tunnel.emit('ok', {
                sendTime: speak.sendTime,
                sender: speak.sender
              })
            }
          })

          var unread = wx.getStorageSync('unreadMap')
          if (unread == '') {
            unread = {}
          }
          unread[speak.sender] = true
          wx.setStorage({
            key: 'unreadMap',
            data: unread,
          })
        },

        fail: function(error) {
          var data = []
          console.log('有人发消息了2')
          data.push(speak)
          wx.setStorage({
            key: 'spk' + speak.sender,
            data: data,
            success: function() {
              app.tunnel.emit('ok', {
                sendTime: speak.sendTime,
                sender: speak.sender
              })
            }
          })
          var unread = wx.getStorageSync('unreadMap')
          if (unread == '') {
            unread = {}
          }
          unread[speak.sender] = true
          wx.setStorage({
            key: 'unreadMap',
            data: unread,
          })
        },
      })
    })

    tunnel.on('commentPush', comment => {
      this.setData({
        newMsg: true
      })
      comment.word = JSON.parse(comment.word)
      wx.request({
        url: config.service.generalUrl + '/getUserInfo',
        data: {
          openId: comment.sender
        },
        success: function(res) {
          if (res.data.code == 0) {
            var avatarUrl = res.data.data.userInfo.avatarUrl
            var nickName = res.data.data.userInfo.nickName
            var commentMap = wx.getStorageSync('commentMap')
            if (typeof(commentMap) != 'object') {
              commentMap = {}
            }
            commentMap[comment.sender] = comment
            commentMap[comment.sender].unread = true
            commentMap[comment.sender].avatarUrl = avatarUrl
            commentMap[comment.sender].nickName = nickName
            wx.setStorage({
              key: 'commentMap',
              data: commentMap,
              success: function() {
                app.tunnel.emit('ok', {
                  sendTime: comment.sendTime,
                  sender: comment.sender
                })
              }
            })
          }
        }
      })

    })


    tunnel.on('remind', remind => {
      //显示未读消息点点
      if (remind.length > 0) {
        that.setData({
          newMsg: true
        })
      }
      //util.showModel('提醒', remind)
      //使用map保存每个发送人的消息队列
      var speakMap = {}
      var commentMap = wx.getStorageSync('commentMap')
      if (typeof(commentMap) != 'object') {
        commentMap = {}
      }
      for (var i = 0; i < remind.length; i++) {
        var msg = remind[i]
        if (msg.msgType == 0 || msg.msgType == 1) {
          if (speakMap[msg.sender] == null) {
            speakMap[msg.sender] = []
          }
          speakMap[msg.sender].push(msg)
        }
        if (msg.msgType == 2) {
          // if (commentMap[msg.sender] == null) {
          // 	commentMap[msg.sender] = []
          // }
          // commentMap[msg.sender].push(msg)
          msg.word = JSON.parse(msg.word)
          commentMap[msg.sender] = msg
          commentMap[msg.sender].unread = true
        }
      }
      ////////
      wx.request({
        url: config.service.generalUrl + '/getUsersInfo',
        data: {
          senders: Object.keys(commentMap)
        },
        success: function(res) {
          if (res.data.code == 0) {
            var datas = res.data.data
            for (var i = 0; i < datas.length; i++) {
              var userInfo = datas[i].userInfo
              commentMap[userInfo.openId].avatarUrl = userInfo.avatarUrl
              commentMap[userInfo.openId].nickName = userInfo.nickName
              wx.setStorage({
                key: 'commentMap',
                data: commentMap,
              })
            }
          }
        }
      })

      for (var sender in speakMap) {
        //设置未读消息
        var unread = wx.getStorageSync('unreadMap')
        if (unread == '') {
          unread = {}
        }
        unread[sender] = true
        wx.setStorage({
          key: 'unreadMap',
          data: unread,
        })

        //将不同发送人发送的消息，分别存放到对应的存储中
        var speakList = speakMap[sender]
        //排序每个人的消息队列
        speakList.sort((a, b) => {
          return new Date(a.sendTime) - new Date(b.sendTime)
        })
        //获取关于每个人的消息队列存储
        var spkHistory = wx.getStorageSync('spk' + sender)
        if (spkHistory == '') {
          spkHistory = []
        }
        //按顺序加入每个人的消息队列并再次存回
        for (var j in speakList) {
          speakList[j].who = 1
          spkHistory.push(speakList[j])
        }
        console.log(spkHistory)
        wx.setStorageSync('spk' + sender, spkHistory)
      }


      app.tunnel.emit('remindOk', {})

    })

    // 打开信道
    tunnel.open()

    //this.setData({ tunnelStatus: 'connecting' })
    app.tunnelStatus = 'connecting'
		this.sendMessage()
  },


  sendMessage() {
    if (!app.tunnelStatus || !app.tunnelStatus === 'connected') return
    // 使用 tunnel.isActive() 来检测当前信道是否处于可用状态
    if (app.tunnel && app.tunnel.isActive()) {
      // 使用信道给服务器推送「speak」消息
      app.tunnel.emit('speak', {
        'word': 'I say something at ' + new Date(),
      });
    }
  },

  closeTunnel() {
    if (app.tunnel) {
      app.tunnel.close();
    }
    util.showBusy('信道连接中...')
    //this.setData({ tunnelStatus: 'closed' })
    app.tunnelStatus = 'closed'
  },
  previewImage: function(e) {
    var current = e.target.dataset.src;
    var idx = e.target.dataset.idx;
    wx.previewImage({
      current: current, // 当前显示图片的http链接  
      urls: this.data.assists[idx].picture // 需要预览的图片http链接列表  
    })
  },
  // getAssistType:function(){
  // 	var that = this;
  // 	wx.request({
  // 		url: config.service.generalUrl + '/getAssistType',
  // 		data:{
  // 		},
  // 		success: function (res) {
  // 			console.log('++++++++++++')
  // 			console.log(res)
  // 			if (res.data.code == 0) {
  // 				getApp().data.assistType=res.data.data;
  // 				that.data.assistType.push({id:-1,type:'综合'});
  // 				that.data.assistType=that.data.assistType.concat(res.data.data);
  // 				that.setData({
  // 					assistType: that.data.assistType
  // 				})
  // 				that.getAssists()
  // 			}
  // 		}
  // 	})
  // }, 
  bindPickerChange(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
		this.data.typeindex = e.detail.value
    this.setData({
      typeindex: this.data.typeindex
    })
		this.onShow()
  },
  setTap() {
    wx.navigateTo({
      url: '/pages/setLocation/setLocation',
    })
  },
  getRelLocation() {
    var that = this;
    var location = app.data.location.latitude + ',' + app.data.location.longitude
    wx.request({
      url: config.API.geocodeUrl,
      data: {
        ak: config.API.baiduAK,
        location: location,
        output: 'json',
      },
      success(res) {
        console.log('百度api======-=-=-=-')
        console.log(res)
        that.setData({
          formattedAddress: res.data.result.formatted_address
        })
      },
      fail(error) {
        console.log(error)
      }
    })
  }
})