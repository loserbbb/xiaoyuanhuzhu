const { mysql } = require('../qcloud.js')
const checkparam = require('../tools/checkparam.js')
const crypto = require('../tools/crypto.js')


async function getAssist(ctx, next) {
	var { assistId } = ctx.query

	assistId = parseInt(assistId)
	if (isNaN(assistId)) {
		ctx.data = 'ERR_WHEN_CHECK_PARAMETER'
		ctx.state.code = 1
		return
	}



	var result = await mysql.select('cAssist.assistId', 'cAssist.publisher', 'cAssist.reward', 'cAssist.status', 'cAssist.discription', 'cAssist.title', 'cAssist.picture', 'cAssist.location', 'cAssist.createTime', 'cSessionInfo.user_info').from('cAssist').innerJoin('cSessionInfo', 'cAssist.publisher', 'cSessionInfo.open_id').where('assistId', assistId).first()

	if (result) {
		result.title = crypto.fromBase64(result.title)
		result.discription = crypto.fromBase64(result.discription)
		result.picture = JSON.parse(crypto.fromBase64(result.picture))
		result.location = JSON.parse(result.location)
		result.userInfo = JSON.parse(result.user_info)
		delete result.user_info
		ctx.state.code = 0
	} else {
		result = await mysql.select('cHistory.assistId', 'cHistory.publisher', 'cHistory.reward', 'cHistory.status', 'cHistory.discription', 'cHistory.title', 'cHistory.picture', 'cHistory.location', 'cHistory.createTime', 'cSessionInfo.user_info').from('cHistory').innerJoin('cSessionInfo', 'cHistory.publisher', 'cSessionInfo.open_id').where('assistId', assistId).first()
		if(result){
			result.title = crypto.fromBase64(result.title)
			result.discription = crypto.fromBase64(result.discription)
			result.picture = JSON.parse(crypto.fromBase64(result.picture))
			result.location = JSON.parse(result.location)
			result.userInfo = JSON.parse(result.user_info)
			delete result.user_info
			ctx.state.code = 0
		}else{
			ctx.state.code = 1
		}
	
	}
	ctx.state.data = result
}


module.exports = getAssist