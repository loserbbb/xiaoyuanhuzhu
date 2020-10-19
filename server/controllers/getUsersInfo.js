const { mysql } = require('../qcloud.js')
const checkparam = require('../tools/checkparam.js')
var crypto = require('../tools/crypto.js')

async function getUsersInfo(ctx, next) {
	var { senders } = ctx.query
	senders = JSON.parse(senders)
	if (typeof(senders) != 'object') {
		ctx.data = 'ERR_WHEN_CHECK_PARAMETER'
		ctx.state.code = 1
		return
	}
	var result = await mysql('cSessionInfo').select('user_info').whereIn('open_id', senders)
	if (result) {
		for(var i = 0;i < result.length; i++){
			result[i].userInfo = JSON.parse(result[i].user_info)
			delete result[i].user_info
		}

		
		ctx.state.code = 0
	} else {
		ctx.state.code = 1
	}
	ctx.state.data = result
}

module.exports = getUsersInfo