const { mysql } = require('../qcloud.js')
const checkparam = require('../tools/checkparam.js')
var crypto = require('../tools/crypto.js')

async function getCoin(ctx, next) {
	const { openId } = ctx.query
	if (!checkparam({ openId })) {
		ctx.data = 'ERR_WHEN_CHECK_PARAMETER'
		ctx.state.code = 1
		return
	}
	var result = await mysql('cUser').select('coin').where('openId', openId).first()
	if (result) {
		ctx.state.code = 0
	} else {
		ctx.state.code = 1
	}
	ctx.state.data = result
}

module.exports = getCoin