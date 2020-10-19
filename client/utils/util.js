const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const s = 1000
const m = s * 60
const h = m * 60
const d = h * 24
const mo = d * 30
const y = mo * 12


const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}


// 显示繁忙提示
var showBusy = text => wx.showToast({
    title: text,
    icon: 'loading',
    duration: 10000
})

// 显示成功提示
var showSuccess = text => wx.showToast({
    title: text,
    icon: 'success'
})

// 显示失败提示
var showModel = (title, content) => {
    wx.hideToast();

    wx.showModal({
        title,
        content: JSON.stringify(content),
        showCancel: false
    })
}

var calculateDistance = function (locationOfComer, locationOfPlayer) {
	// 37.957903,112.53809
	// lati	 long
	var radLat1 = locationOfComer.latitude * Math.PI / 180.0;
	var radLat2 = locationOfPlayer.latitude * Math.PI / 180.0;
	var a = radLat1 - radLat2;
	var b = locationOfComer.longitude * Math.PI / 180.0 - locationOfComer.longitude * Math.PI / 180.0;
	var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
	s = s * 6378.137;
	return s * 1000;
}

var getNowFormatDate = function (date) {
	var seperator1 = "-";
	var seperator2 = ":";
	var month = date.getMonth() + 1;
	var strDate = date.getDate();
	if (month >= 1 && month <= 9) {
		month = "0" + month;
	}
	if (strDate >= 0 && strDate <= 9) {
		strDate = "0" + strDate;
	}
	var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
		+ " " + date.getHours() + seperator2 + date.getMinutes()
		+ seperator2 + date.getSeconds();
	return currentdate;
}

var timeToNow = function(time){
	var date = new Date(time)
	var dt = Date.now() - date
	if(isNaN(dt)){
		date = StringToDate(time)
		dt = Date.now() - date
	}
	if (dt < m) {
		return (dt / s).toFixed(0) + ' 秒前'
	} else if (dt < h) {
		return (dt / m).toFixed(0) + ' 分钟前'
	} else if (dt < d) {
		return (dt / h).toFixed(0) + ' 小时前'
	} else if (dt < mo) {
		return (dt / d).toFixed(0) + ' 天前'
	} else if (dt < y) {
		return (dt / mo).toFixed(0) + ' 月前'
	} else {
		return (dt / y).toFixed(0) + ' 年前'
	}
}

function StringToDate(s) {
	var d = new Date();
	d.setYear(parseInt(s.substring(0, 4), 10));
	d.setMonth(parseInt(s.substring(5, 7) - 1, 10));
	d.setDate(parseInt(s.substring(8, 10), 10));
	d.setHours(parseInt(s.substring(11, 13), 10));
	d.setMinutes(parseInt(s.substring(14, 16), 10));
	d.setSeconds(parseInt(s.substring(17, 19), 10));
	return d;
}

var getDate = function () {
	var date = new Date();
	var year = date.getFullYear();
	var month = date.getMonth() + 1;
	var day = date.getDate();
	if (month < 10) {
		month = "0" + month;
	}
	if (day < 10) {
		day = "0" + day;
	}
	return year + "-" + month + "-" + day;
}
module.exports = { formatTime, showBusy, showSuccess, showModel, calculateDistance, getNowFormatDate,timeToNow,getDate}
