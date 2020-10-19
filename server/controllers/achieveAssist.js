const { mysql } = require('../qcloud.js')
const checkparam = require('../tools/checkparam.js')
const crypto = require('../tools/crypto.js')


async function achieveAssist(ctx, next) {
	var { assistId } = ctx.query

	assistId = parseInt(assistId)
	if (isNaN(assistId)) {
		ctx.data = 'ERR_WHEN_CHECK_PARAMETER'
		ctx.state.code = 1
		return
	}



	var assist = await mysql.select('*').from('cAssist').innerJoin('cSessionInfo','cSessionInfo.open_id','cAssist.publisher').where('assistId', assistId).first()
	if(!assist){
		ctx.state.code = 1
		return
	}
	assist.userInfo = JSON.parse(assist.user_info)
	await mysql('cUser').where('openId', assist.accepter).increment('coin',assist.reward)
	var task = {
		userId: assist.accepter,
		taskId: 0,
		achieveTime: crypto.getNowFormatDate(),
		getReward: assist.reward,
		discription: crypto.toBase64('向 '+assist.userInfo.nickName+' 提供帮助获得积分')
	}
	await mysql('cTaskAchieve').insert(task)
	await mysql('cHistory').insert({
		assistId:assist.assistId,
		publisher:assist.publisher,
		reward:assist.reward,
		status:2,
		discription:assist.discription,
		title:assist.title,
		picture:assist.picture,
		location:assist.location,
		accepter:assist.accepter,
		createTime:assist.createTime,
		archieveTime:assist.archieveTime
	})
	var result = await mysql('cAssist').where({assistId}).del()

	if (result) {
		ctx.state.code = 0
	} else {
		ctx.state.code = 1
	}
	ctx.state.data = result
}


module.exports = achieveAssist