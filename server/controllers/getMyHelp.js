const { mysql } = require('../qcloud.js')
const checkparam = require('../tools/checkparam.js')
const crypto = require('../tools/crypto.js')


async function getMyHelp(ctx, next) {
	var { openId, status } = ctx.query
	status = parseInt(status)

	if (!checkparam({ openId }) || isNaN(status)) {
		ctx.data = 'ERR_WHEN_CHECK_PARAMETER'
		ctx.state.code = 1
		return
	}

	if (status == 0) {
		var result = await mysql.select('cAssist.assistId', 'cAssist.publisher', 'cAssist.accepter', 'cAssist.reward', 'cAssist.status', 'cAssist.discription', 'cAssist.title', 'cAssist.picture', 'cAssist.location', 'cAssist.createTime', 'cAssist.archieveTime', 'cSessionInfo.user_info').from('cAssist').leftJoin('cSessionInfo', 'cAssist.publisher', 'cSessionInfo.open_id').where('accepter', openId)
	} else {
		var result = await mysql.select('cHistory.assistId', 'cHistory.publisher', 'cHistory.accepter', 'cHistory.reward', 'cHistory.status', 'cHistory.discription', 'cHistory.title', 'cHistory.picture', 'cHistory.location', 'cHistory.createTime', 'cHistory.archieveTime', 'cSessionInfo.user_info').from('cHistory').leftJoin('cSessionInfo', 'cHistory.publisher', 'cSessionInfo.open_id').where('accepter', openId)
	}



	if (result) {
		for (var i = 0; i < result.length; i++) {
			var item = result[i]
			item.title = crypto.fromBase64(item.title)
			item.discription = crypto.fromBase64(item.discription)
			item.picture = JSON.parse(crypto.fromBase64(item.picture))
			item.location = JSON.parse(item.location)
			item.userInfo = JSON.parse(item.user_info)
			delete item.user_info
		}
		ctx.state.code = 0
	} else {
		ctx.state.code = 1
	}
	ctx.state.data = result
}


module.exports = getMyHelp