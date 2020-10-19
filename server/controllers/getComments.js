const { mysql } = require('../qcloud.js')
const checkparam = require('../tools/checkparam.js')
var crypto = require('../tools/crypto.js')


async function getComments(ctx,next){
	var { assistId } = ctx.query
	assistId = parseInt(assistId)
	if(isNaN(assistId)){
		ctx.data = 'ERR_WHEN_CHECK_PARAMETER'
		ctx.state.code = 1
		return
	}
	var result = await mysql.select('cComment.commentId', 'cComment.commentType', 'cComment.assistId', 'cComment.targetComment', 'cComment.content','cComment.createTime','cSessionInfo.user_info').from('cComment').innerJoin('cSessionInfo','cComment.writer','cSessionInfo.open_id').where({assistId})
	if(result){
		for(var i = 0;i < result.length; i++){
			var comment = result[i]
			comment.content = crypto.fromBase64(comment.content)
			comment.userInfo = JSON.parse(comment.user_info)
			delete comment.user_info
		}
	
		ctx.state.code = 0
	}else{
		ctx.state.code = 1
	}
	ctx.state.data = result
}

module.exports = getComments