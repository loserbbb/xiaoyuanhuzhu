const { mysql } = require('../qcloud.js')
const checkparam = require('../tools/checkparam.js')
const crypto = require('../tools/crypto.js')


async function delHistory(ctx, next) {
	var { assistId } = ctx.query

	assistId = parseInt(assistId)
	if (isNaN(assistId)) {
		ctx.data = 'ERR_WHEN_CHECK_PARAMETER'
		ctx.state.code = 1
		return
	}



	var result = await mysql('cHistory').where({assistId}).del()


	if (result) {
		ctx.state.code = 0
	} else {
		ctx.state.code = 1
	}
	ctx.state.data = result
}


module.exports = delHistory