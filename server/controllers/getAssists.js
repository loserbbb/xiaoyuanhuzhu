const { mysql } = require('../qcloud.js')
const checkparam = require('../tools/checkparam.js')
const crypto = require('../tools/crypto.js')
const ngeohash = require('../tools/ngeohash/main.js')

async function getAssists(ctx,next){
	var {openId,location,precision} = ctx.query
	location = JSON.parse(location)
	precision = parseInt(precision)
	if (!checkparam({ openId, location }) || isNaN(precision) || precision < 0 || precision > 9) {
		ctx.data = 'ERR_WHEN_CHECK_PARAMETER'
		ctx.state.code = 1
		return
	}
	var hashOfReq = ngeohash.encode(location.latitude,location.longitude).substr(0,precision)
	var neighbors = ngeohash.neighbors(hashOfReq)
	var hashOfQuery = hashOfReq + '%'
	var result = await mysql.select('cAssist.assistId', 'cAssist.publisher', 'cAssist.reward', 'cAssist.status', 'cAssist.discription', 'cAssist.title', 'cAssist.picture', 'cAssist.location', 'cAssist.createTime', 'cSessionInfo.user_info').from('cAssist').innerJoin('cSessionInfo', 'cAssist.publisher', 'cSessionInfo.open_id').where('geohash', 'like', hashOfQuery).orWhere('geohash', 'like', neighbors[0] + '%').orWhere('geohash', 'like', neighbors[1] + '%').orWhere('geohash', 'like', neighbors[2] + '%').orWhere('geohash', 'like', neighbors[3] + '%').orWhere('geohash', 'like', neighbors[4] + '%').orWhere('geohash', 'like', neighbors[5] + '%').orWhere('geohash', 'like', neighbors[6] + '%').orWhere('geohash', 'like', neighbors[7] + '%')

	


	if(result){
		for(var i = 0;i < result.length;i ++){
			var item = result[i]
			item.title = crypto.fromBase64(item.title)
			item.discription = crypto.fromBase64(item.discription)
			item.picture = JSON.parse(crypto.fromBase64(item.picture))
			item.location = JSON.parse(item.location)
			item.userInfo = JSON.parse(item.user_info)
			delete item.user_info
		}
		
		ctx.state.code = 0
	}else{
		ctx.state.code = 1
	}
	ctx.state.data = result
}


module.exports = getAssists
//https://jrfsywzr.qcloud.la/weapp/getAssists?openId=o6xPM4gmpnzSvYgGVVz67kJ_GFxo&location={"latitude":37.94036,"longitude":112.48699,"speed":-1,"accuracy":65,"altitude":0,"verticalAccuracy":65,"horizontalAccuracy":65,"errMsg":"getLocation:ok","geohash":"wqxzzdyd8"}&precision=4