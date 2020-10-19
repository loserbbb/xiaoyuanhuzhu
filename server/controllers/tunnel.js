const { tunnel } = require('../qcloud')
const debug = require('debug')('koa-weapp-demo')
const { mysql } = require('../qcloud.js')
const crypto = require('../tools/crypto.js')
 

const $sendMsg = (type, content, target) => {
	tunnel.broadcast(target, type, content).then(result => {
		const invalidTunnelIds = result.data && result.data.invalidTunnelIds || []
		if (invalidTunnelIds.length) {
			console.log('检测到无效的信道 IDs =>', invalidTunnelIds)

			invalidTunnelIds.forEach(tunnelId => {
				mysql('cUser').update('tunnelId', null).where('tunnelId',tunnel).then(res => {
					console.log(res)
				})

			})
		}
	})
}

/**
 * 调用 TunnelService.closeTunnel() 关闭信道
 * @param  {String} tunnelId 信道ID
 */
const $close = (tunnelId) => {
	tunnel.closeTunnel(tunnelId)
}

/**
 * 实现 onConnect 方法
 * 在客户端成功连接 WebSocket 信道服务之后会调用该方法，
 * 此时通知所有其它在线的用户当前总人数以及刚加入的用户是谁
 */
async function onConnect(tunnelId) {
	console.log(`[onConnect] =>`, { tunnelId })
	var result = await mysql('cUser').where('tunnelId', tunnelId)
	if (result.length == 1) {
		var msg = await mysql('cMessage').where('receiver', result[0].openId)
		for(var i in msg){
			msg[i].word = crypto.fromBase64(msg[i].word)
		}
		$sendMsg('remind', msg, [tunnelId])

	} else {
		console.log(`Unknown tunnelId(${tunnelId}) was connectd, close it`)
		$close(tunnelId)
	}
}

/**
 * 实现 onMessage 方法
 * 客户端推送消息到 WebSocket 信道服务器上后，会调用该方法，此时可以处理信道的消息。
 * 在本示例，我们处理 `speak` 类型的消息，该消息表示有用户发言。
 * 我们把这个发言的信息广播到所有在线的 WebSocket 信道上
 */
async function onMessage(tunnelId, type, content) {
	console.log(`[onMessage] =>`, { tunnelId, type, content })

	switch (type) {
		case 'speak':
			var receiverOpenId = content.receiver
			var receiver = await mysql('cUser').select('tunnelId', 'openId').where('openId', receiverOpenId)
			if (receiver.length != 1) {
				return
			}

			var sender = await mysql('cUser').where('tunnelId', tunnelId)

			if (sender.length == 1) {
				var msg = {
					sender: sender[0].openId,
					receiver: receiver[0].openId,
					sendTime: content.sendTime,
					word: crypto.toBase64(content.word),
					msgType: content.msgType,
				}
				var res = await mysql('cMessage').insert(msg)
				if (receiver[0].tunnelId) {
					$sendMsg('speak', {
						'sender': sender[0].openId,
						'word': content.word,
						'sendTime': content.sendTime,
						'msgType': content.msgType
					}, [receiver[0].tunnelId])
				}

			} else {
				$close(tunnelId)
			}
			break
		case 'ok':
			var who = await mysql('cUser').where('tunnelId', tunnelId)
			if (who.length == 1) {
				var sendTime = content.sendTime
				var sender = content.sender
				var result = await mysql('cMessage').del().where({ sender, sendTime })
				if (result) {
					var senderTunnel = await mysql('cUser').select('tunnelId').where('openId', sender).first()
					if (senderTunnel) {
						$sendMsg('ok', {
							'sendTime': sendTime
						})
					}
				}
			} else {
				$close(tunnelId)
			}
			break
		case 'remindOk':
			var who = await mysql('cUser').where('tunnelId', tunnelId)
			if(who.length == 1){
				var reslut = await mysql('cMessage').del().where('receiver',who[0].openId)
				console.log(reslut)
			} else {
				$close(tunnelId)
			}
			break
		default:
			break
	}
}

/**
 * 实现 onClose 方法
 * 客户端关闭 WebSocket 信道或者被信道服务器判断为已断开后，
 * 会调用该方法，此时可以进行清理及通知操作
 */
async function onClose(tunnelId) {
	console.log(`[onClose] =>`, { tunnelId })
	var result = await mysql('cUser').where({ tunnelId })
	if (!(result.length == 1)) {
		console.log(`[onClose][Invalid TunnelId]=>`, tunnelId)
		$close(tunnelId)
		return
	}
	var res = await mysql('cUser').update('tunnelId', null).where({ tunnelId })
	console.log(res)
}

module.exports = {
	// 小程序请求 websocket 地址
	get: async ctx => {
		const data = await tunnel.getTunnelUrl(ctx.req)
		const tunnelInfo = data.tunnel

		var result = await mysql('cUser').update('tunnelId', tunnelInfo.tunnelId).where('openId', data.userinfo.openId)



		ctx.state.data = tunnelInfo
	},

	// 信道将信息传输过来的时候
	post: async ctx => {
		const packet = await tunnel.onTunnelMessage(ctx.request.body)

		debug('Tunnel recive a package: %o', packet)

		switch (packet.type) {
			case 'connect':
				onConnect(packet.tunnelId)
				break
			case 'message':
				onMessage(packet.tunnelId, packet.content.messageType, packet.content.messageContent)
				break
			case 'close':
				onClose(packet.tunnelId)
				break
		}
	},
	
	sendMsg: $sendMsg

}
