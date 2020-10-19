const { mysql } = require('../qcloud.js')
const checkparam = require('../tools/checkparam.js')
const crypto = require('../tools/crypto.js')
const tunnel = require('./tunnel.js')

async function setComment(ctx,next){
	var {openId,commentType,assistId,targetComment,content} = ctx.query
	commentType = parseInt(commentType)
	targetComment = parseInt(targetComment)
	assistId = parseInt(assistId)
	if(!checkparam({openId,content}) || isNaN(commentType) || isNaN(targetComment) || isNaN(assistId)){
		ctx.data = 'ERR_WHEN_CHECK_PARAMETER'
		ctx.state.code = 1
		return
	}
	var now = crypto.getNowFormatDate()

	var comment = {
		writer:openId,
		commentType:commentType,
		assistId:assistId,
		targetComment:targetComment,
		content:crypto.toBase64(content),
		createTime: now
	}
	var result = await mysql('cComment').insert(comment)
	if(result){
		ctx.state.code = 0
	}else{
		ctx.state.code = 1
	}
	ctx.state.data = result

	//通过tunnel通知
  var target = null
	if(commentType == 1){
		target = await mysql.select('tunnelId','openId').from('cComment').innerJoin('cUser','cComment.writer','cUser.openId').where('commentId',targetComment).first()
	}else{
		target = await mysql.select('tunnelId','openId').from('cAssist').innerJoin('cUser','cAssist.publisher','cUser.openId').where('assistId',assistId).first()
	}
	var word = {
		content:content,
		assistId:assistId
	}
	word = JSON.stringify(word)
	var msg = {
		sender: openId,
		receiver: target.openId,
		sendTime: now,
		word: word,
		msgType: 2,
	}
	tunnel.sendMsg('commentPush',msg,[target.tunnelId])
	msg.word = crypto.toBase64(word)
	var res = await mysql('cMessage').insert(msg)
	console.log(res)
}


module.exports = setComment