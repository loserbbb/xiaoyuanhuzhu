/**
 * ajax 服务路由集合
 */
const router = require('koa-router')({
    prefix: '/weapp'
})
const controllers = require('../controllers')

// 从 sdk 中取出中间件
// 这里展示如何使用 Koa 中间件完成登录态的颁发与验证
const { auth: { authorizationMiddleware, validationMiddleware } } = require('../qcloud')

// --- 登录与授权 Demo --- //
// 登录接口
router.get('/login', authorizationMiddleware, controllers.login)
// 用户信息接口（可以用来验证登录态）
router.get('/user', validationMiddleware, controllers.user)

// --- 图片上传 Demo --- //
// 图片上传接口，小程序端可以直接将 url 填入 wx.uploadFile 中
router.post('/upload', controllers.upload)

// --- 信道服务接口 Demo --- //
// GET  用来响应请求信道地址的
router.get('/tunnel', controllers.tunnel.get)
// POST 用来处理信道传递过来的消息
router.post('/tunnel', controllers.tunnel.post)

// --- 客服消息接口 Demo --- //
// GET  用来响应小程序后台配置时发送的验证请求
router.get('/message', controllers.message.get)
// POST 用来处理微信转发过来的客服消息
router.post('/message', controllers.message.post)

//注册基本信息
router.get('/register',controllers.register)
//获取注册信息
router.get('/checkRegister',controllers.checkRegister)
//测试接口，删除用户信息
router.get('/delUser',controllers.delUser)
//发布帮助
router.get('/release',controllers.release)

router.get('/getAssists',controllers.getAssists)

router.get('/getAssist', controllers.getAssist)

router.get('/setComment', controllers.setComment)

router.get('/getComments',controllers.getComments)

router.get('/getUserInfo',controllers.getUserInfo)

router.get('/getUsersInfo', controllers.getUsersInfo)

router.get('/offerHelp', controllers.offerHelp)

router.get('/signIn', controllers.signIn)

router.get('/getMyAssist',controllers.getMyAssist)

router.get('/getMyHelp',controllers.getMyHelp)

router.get('/getDetailsOfCoin', controllers.getDetailsOfCoin)

router.get('/delHistory', controllers.delHistory)

router.get('/delAssist',controllers.delAssist)

router.get('/getCoin',controllers.getCoin)

router.get('/achieveAssist',controllers.achieveAssist)

router.get('/cancelHelp',controllers.cancelHelp)

router.get('/hh', controllers.hh)

module.exports = router
