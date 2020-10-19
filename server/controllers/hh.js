const {mysql} = require('../qcloud.js')

module.exports = async (ctx,next) => {

  var param = ctx.query
	const data = await mysql('cUser')
  ctx.state.data = data
}
//小程序控制台phpmyadmin里给数据库cAuth添加表
/*
//controllers/hello.js
const { mysql } = require('../qcloud')

module.exports = async ctx => {
	console.log('exeu sql')
	var id = 2
	//add
	var book = {
		id: id,
		name: "bingyuhuozhige",
		price: 88
	}
	await mysql("Book").insert(book)
	//search
	var res = await mysql("Book").where({ id }).first()
	console.log(res)
	//update
	await mysql("Book").update({ price: 66 }).where({ id })
	//search
	var res = await mysql("Book").where({ id }).first()
	console.log(res)
	//delete
	await mysql("Book").del().where({ id })
	//search
	var res = await mysql("Book").where({ id }).first()
	console.log(res)

	ctx.state.data = {
		msg: 'zheng junfei hello'
	}
}
*/
