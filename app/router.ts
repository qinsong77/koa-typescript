import Router from '@koa/router'
import AuthController from './controllers/auth'
import UserController from './controllers/user'
import { DefaultState, Context } from 'koa'

// 添加Router泛型类型
const router = new Router<DefaultState, Context>({
    prefix: '/api'
})

// auth 相关的路由
router.post('/public/auth/login', AuthController.login)
router.post('/public/auth/register', AuthController.register)

// users 相关的路由
router.get('/users', UserController.listUsers)
router.get('/users/:id', UserController.showUserDetail)
router.put('/users/:id', UserController.updateUser)
router.delete('/users/:id', UserController.deleteUser)
router.post('/users/add_friend', UserController.sendAddFriendMessage)

export default router

