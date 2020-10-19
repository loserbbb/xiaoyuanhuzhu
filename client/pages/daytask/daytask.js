
var app = getApp() 

Page({

  /**
   * 页面的初始数据
   */
  data: {
    tempFilePaths: ''
  }, 


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
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

   choose: function () {
    var that = this
    wx.chooseImage({
      count: 9,
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'],
      success: function (res) {
        var tempFilePaths = res.tempFilePaths
        that.setData({
          tempFilePaths: res.tempFilePaths
        })
        console.log(res.tempFilePaths)
        wx.setStorage({ key: "card", data: tempFilePaths[0] })
      }
    })
  },

   formSubmit2: function (e) {
     var that = this
     var card = wx.getStorageSync('card')
     wx.uploadFile({
       url: app.globalData.create_funds,
       filePath: card,
       name: 'card',
       formData: {
         'user_id': app.globalData.user_id,
         'person': e.detail.value.person,
         'company': e.detail.value.company,
       },
       success: function (res) {
         console.log(res)
       }
     })
   

 },

   upShopLogo: function () {
     var that = this;
     wx.showActionSheet({
       itemList: ['从相册中选择', '拍照'],
       itemColor: "#f7982a",
       success: function (res) {
         if (!res.cancel) {
           if (res.tapIndex == 0) {
             that.chooseWxImageShop('album')
           } else if (res.tapIndex == 1) {
             that.chooseWxImageShop('camera')
           }
         }
       }
     })
   },

   chooseWxImageShop: function (type) {
     var that = this;
     wx.chooseImage({
       sizeType: ['original', 'compressed'],
       sourceType: [type],
       success: function (res) {
         /*上传单张
             that.data.orderDetail.shopImage = res.tempFilePaths[0],
             that.upload_file(API_URL + 'shop/shopIcon', res.tempFilePaths[0])
         */
         /*上传多张（遍历数组，一次传一张）
            for (var index in res.tempFilePaths) {
               that.upload_file(API_URL + 'shop/shopImage', res.tempFilePaths[index])
            }
        */
       }
     })
   },
   upload_file: function (url, filePath) {
     var that = this;
     wx.uploadFile({
       url: url,
       filePath: filePath,
       name: 'uploadFile',
       header: {
         'content-type': 'multipart/form-data'
       }, // 设置请求的 header
       formData: { 'shopId': wx.getStorageSync('shopId') }, // HTTP 请求中其他额外的 form data
       success: function (res) {
         wx.showToast({
           title: "图片修改成功",
           icon: 'success',
           duration: 700
         })
       },
       fail: function (res) {
       }
     })
   },
   
chooseimage: function () {
     var _this = this;
     wx.chooseImage({
       count: 1, // 默认9 
       sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有 
       sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有 
       success: function (res) {
         // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片 
         _this.setData({
           tempFilePaths: res.tempFilePaths
         })
       }
     })
   } 
   ,
tiao1: function () {
  wx.navigateTo({
    url: '../signIn/signIn'
  })
},
   
})
