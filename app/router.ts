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
router.get('/users/friends/list', UserController.listFriend)
router.get('/users/:id', UserController.showUserDetail)
router.put('/users/:id', UserController.updateUser)
router.delete('/users/:id', UserController.deleteUser)
router.post('/users/add_friend', UserController.sendAddFriendMessage)
router.post('/users/add_friend_agree', UserController.addFriendAgree)
router.get('/users/msg/new_add', UserController.listAddMessage)


export default router

