const { mysql } = require('../qcloud.js')
const checkparam = require('../tools/checkparam.js')
const crypto = require('../tools/crypto.js')
const ngeohash = require('../tools/ngeohash/main.js')
const tunnel = require('./tunnel.js')

async function release(ctx,next){
	var {publisher,title,reward,discription,picture,location} = ctx.query
	picture = JSON.parse(picture)
	location = JSON.parse(location)
	if (!checkparam({ publisher, title, reward, discription, picture, location})){
		ctx.data = 'ERR_WHEN_CHECK_PARAMETER'
		ctx.state.code = 1
		return
	}else{
		picture = JSON.stringify(picture)
		reward = parseInt(reward)
		location.geohash = ngeohash.encode(location.latitude,location.longitude)
		var geohash = location.geohash
		location = JSON.stringify(location)
		title = crypto.toBase64(title)
		discription = crypto.toBase64(discription)
		picture = crypto.toBase64(picture)
		var assist = {
			publisher:publisher,
			title:title,
			reward:reward,
			discription:discription,
			picture:picture,
			location:location,
			status:0,
			createTime: crypto.getNowFormatDate(),
			geohash:geohash
		}
		var who = await mysql('cUser').where('openId',publisher).first()
		if(who.coin < reward){
			ctx.state.code = 1
			ctx.state.data = '积分不够'
			return
		}
		var deal = await mysql('cUser').where('openId', publisher).decrement('coin', reward)
		if(deal){
			tunnel.sendMsg('coinPush',{coin:who.coin - reward},[who.tunnelId])
		}else{
			ctx.state.code = 1
			return
		}
		// 	ctx.state.code = 1
		// }
		var result = await mysql('cAssist').insert(assist)
		if(result.length != 0){
			ctx.state.code = 0
		}else{
			ctx.state.code = 1
		}
		
		
		ctx.state.data = result
		
	}
}

module.exports = release