const { mysql } = require('../qcloud.js')
const checkparam = require('../tools/checkparam.js')
// var crypto = require('../tools/crypto.js')

async function cancelHelp(ctx, next) {
	var { assistId } = ctx.query
	assistId = parseInt(assistId)
	if (isNaN(assistId)) {
		ctx.data = 'ERR_WHEN_CHECK_PARAMETER'
		ctx.state.code = 1
		return
	}
	var assist = await mysql('cAssist').where({ assistId }).first()
	if (!assist) {
		ctx.state.code = 1
		return
	}
	if (assist.status != 1) {
		ctx.state.code = 2
		return
	}
	var result = await mysql('cAssist').update({ 'accepter': null, 'status': 0 }).where({ assistId })

	if (result) {
		ctx.state.code = 0
	} else {
		ctx.state.code = 1
	}
	ctx.state.data = result
}

module.exports = cancelHelp