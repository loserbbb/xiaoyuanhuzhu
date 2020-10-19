const { mysql } = require('../qcloud.js')
const checkparam = require('../tools/checkparam.js')
const crypto = require('../tools/crypto.js')
const tunnel = require('./tunnel.js')

async function delAssist(ctx, next) {
	var { assistId } = ctx.query

	assistId = parseInt(assistId)
	if (isNaN(assistId)) {
		ctx.data = 'ERR_WHEN_CHECK_PARAMETER'
		ctx.state.code = 1
		return
	}

	var assist = await mysql('cAssist').where({ assistId }).first()
	if(!assist){
		ctx.state.code = 1
		return
	}
	if(assist.reward != 0){
		var ok = await mysql('cUser').where('openId', assist.publisher).increment('coin', assist.reward)
		if(!ok){
			ctx.state.code = 1
			return
		}
		var who = await mysql('cUser').select('tunnelId').where('openId',assist.publisher).first()
		tunnel.sendMsg('coinPush', {}, [who.tunnelId])
	}
	var result = await mysql('cAssist').where({ assistId }).del()
	if (result) {
		ctx.state.code = 0
	} else {
		ctx.state.code = 1
	}
	ctx.state.data = result
}


module.exports = delAssist