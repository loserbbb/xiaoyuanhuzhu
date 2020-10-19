var session = require('./session.js')
var checkSession = function(id){
	// if(session[id] == null){
	// 	return
	// }
	if (session[id].timestamp - Date.now() > 300000){
		delete session[id]
		return
	}else{
		// session[id].timestamp = Date.now()
		setTimeout(checkSession,30000,id)
	}

}
module.exports = checkSession