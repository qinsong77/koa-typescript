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
router.get('/users/list', UserController.listUsers)


router.post('/user/uploadFile', UserController.uploadFile)
router.get('/user/:id', UserController.showUserDetail)
router.put('/user/:id', UserController.updateUser)
router.delete('/user/:id', UserController.deleteUser)
router.post('/user/friend', UserController.sendAddFriendMessage)
router.get('/user/friends/list', UserController.listFriend)
router.post('/user/add_friend_agree', UserController.addFriendAgree)
router.get('/user/add_friend_message/list', UserController.listAddFriendMessage)
router.get('/user/history_message/list', UserController.listHistoryMessages)


export default router

