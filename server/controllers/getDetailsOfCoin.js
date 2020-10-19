const { mysql } = require('../qcloud.js')
const checkparam = require('../tools/checkparam.js')
const crypto = require('../tools/crypto.js')

async function getDetailsOfCoin(ctx, next) {
	const { openId } = ctx.query
	if (!checkparam({ openId })) {
		ctx.data = 'ERR_WHEN_CHECK_PARAMETER'
		ctx.state.code = 1
		return
	}


	
	var result = await mysql('cTaskAchieve').where('userId',openId)
	
	if (result) {
		for(var i = 0 ;i < result.length;i++){
			result[i].discription = crypto.fromBase64(result[i].discription)
		}
		ctx.state.code = 0
	} else {
		ctx.state.code = 1
	}
	ctx.state.data = result
}

module.exports = getDetailsOfCoin