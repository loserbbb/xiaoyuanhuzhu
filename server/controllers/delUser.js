const { mysql } = require('../qcloud.js')

module.exports = async (ctx, next) => {

	var param = ctx.query
	const data = await mysql('cUser').del()
	ctx.state.data = data
}