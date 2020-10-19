const { mysql } = require('../qcloud.js')
const checkparam = require('../tools/checkparam.js')
const crypto = require('../tools/crypto.js')
const tunnel = require('./tunnel.js')

async function signIn(ctx, next) {
	const { openId } = ctx.query
	if (!checkparam({ openId })) {
		ctx.data = 'ERR_WHEN_CHECK_PARAMETER'
		ctx.state.code = 1
		return
	}
	var date = crypto.getDate()

	var query = {
		userId: openId,
		taskId: 2,
		achieveTime: date
	}
	var signIn = await mysql('cTaskAchieve').where(query)
	if (signIn.length > 0) {
		ctx.state.code = 1
		return
	}
	var task = {
		userId: openId,
		taskId: 2,
		achieveTime: date,
		getReward: 10,
		discription: crypto.toBase64('签到获得积分')
	}
	var result = await mysql('cTaskAchieve').insert(task)
	if(result){
		ctx.state.code = 0
		// var user = mysql('cUser').where({openId})
		// var res = await mysql('cUser').update('coin',user.coin+10).where('openId','=',openId)
		var res = await mysql('cUser').where('openId', '=', openId).increment('coin',10)
		var who = await mysql('cUser').select('tunnelId').where('openId', openId).first()
		tunnel.sendMsg('coinPush', {}, [who.tunnelId])
		console.log(res)
	}else{
		ctx.state.code = 1
	}
	ctx.state.data = result
}

module.exports = signIn