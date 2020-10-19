const {mysql} = require('../qcloud.js')
const checkparam = require('../tools/checkparam.js')
const crypto = require('../tools/crypto.js')

async function register(ctx,next){
  const {openId,realName,phoneNumber,sex} = ctx.query
  if (!checkparam({openId, realName, phoneNumber,sex})){
    ctx.data = 'ERR_WHEN_CHECK_PARAMETER'
		ctx.state.code=1
  }else{
		//realName = crypto.toBase64(realName)
		var user = {
			openId:openId,
			realName: crypto.toBase64(realName),
			phoneNumber:phoneNumber,
			sex:sex,
			coin:0,
			experience:0
		}
    var result = await mysql('cUser').insert(user)
		ctx.state.data = result
		console.log(result)
		
  }
}

module.exports = register