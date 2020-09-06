import jwt from 'jsonwebtoken'
import { JWT_SECRET } from '../constants'
import { Socket } from 'socket.io'

const auth = async (socket: Socket, next: (err?: any) => void) => {
	const token = socket.handshake.query.token
	console.log(token)
	if (!token) {
		console.error(new Error('token not exist'))
		socket.emit('auth', {
			code: 2,
			message: 'token not exist'
			// error: err,
		})
		return next(new Error('token not exist'))
	}
	try {
		const credentials = token.split(' ').slice(-1)[0]
		const data = await jwt.verify(credentials, JWT_SECRET)
		// @ts-ignore
		socket.user = data
		return next()
	} catch (err) {
		//验证不通过的三种类型 name: TokenExpiredError(过期) | JsonWebTokenError(token解释错误) | NotBeforeError(还未到生效期)
		console.error(err)
		socket.emit('auth', {
			code: 1,
			message: 'authentication error',
			error: err,
		})
		return next(new Error('authentication error'))
	}
	
}
export default auth
