/**
 * 小程序配置文件
 */

// 此处主机域名修改成腾讯云解决方案分配的域名
// var host = 'https://jrfsywzr.qcloud.la';
// var host ='http://127.0.0.1:5757';
var host ='http://212.64.22.206:5858';
// var host = 'https://www.bangbang5.cn'

var config = {

    // 下面的地址配合云端 Demo 工作
    service: {
        host,
				generalUrl: `${host}/weapp2`,
        // 登录地址，用于建立会话
        loginUrl: `${host}/weapp2/login`,

        // 测试的请求地址，用于测试会话
        requestUrl: `${host}/weapp2/user`,

        // 测试的信道服务地址
        tunnelUrl: `${host}/weapp2/tunnel`,

        // 上传图片接口
        uploadUrl: `${host}/weapp2/upload`
    },
		API:{
			baiduAK: 'fAz5L241MpZSZzKyPTeQQRlbCzYmDN1K',
			geocodeUrl: 'http://api.map.baidu.com/geocoder/v2/',
		}
};

module.exports = config;
