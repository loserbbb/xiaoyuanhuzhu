const { mysql } = require('../qcloud.js')
const checkparam = require('../tools/checkparam.js')
var crypto = require('../tools/crypto.js')

async function getUserInfo(ctx, next){
	const {openId} = ctx.query
	if(!checkparam({openId})){
		ctx.data = 'ERR_WHEN_CHECK_PARAMETER'
		ctx.state.code = 1
		return
	}
	var result = await mysql('cSessionInfo').select('user_info').where('open_id',openId).first()
	if(result){
		result.userInfo = JSON.parse(result.user_info)
		delete result.user_info
		ctx.state.code = 0
	}else{
		ctx.state.code = 1
	}
	ctx.state.data = result
}

module.exports = getUserInfo