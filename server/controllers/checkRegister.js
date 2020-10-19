const { mysql } = require('../qcloud.js')
const checkparam = require('../tools/checkparam.js')
const crypto = require('../tools/crypto.js')
var session = require('../tools/session.js')
const checkSession = require

async function register(ctx, next) {
	const { openId } = ctx.query
	if (!checkparam({ openId })) {
		ctx.body = 'ERR_WHEN_CHECK_PARAMETER'
		ctx.state.code = 200
	} else {
		session[openId] = {
			timestamp:Date.now()
		}

		
		var result = await mysql('cUser').where({openId}).first()
		if(result){
			result.realName = crypto.fromBase64(result.realName)
			ctx.state.code = 0
			ctx.state.data = result
		}else{
			ctx.state.code = 1
		}
	}
}

module.exports = register