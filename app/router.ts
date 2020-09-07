import Router from '@koa/router'
import AuthController from './controllers/auth'
import UserController from './controllers/user'
import ChatController from './controllers/chat'
import { DefaultState, Context } from 'koa'


// 添加Router泛型类型
const router = new Router<DefaultState, Context>({
    prefix: '/api'
})

// auth 相关的路由
router.post('/public/auth/login', AuthController.login)
router.post('/public/auth/register', AuthController.register)

// users 相关的路由
router.get('/users/list', UserController.UsersList) // 获取所以用户


router.post('/user/uploadFile', UserController.uploadFile) // 上传文件
router.get('/user/:id', UserController.getUserDetail) // 获取详情
router.put('/user/:id', UserController.updateUser) // 用户更改
router.delete('/user/:id', UserController.deleteUser) // 删除

// 聊天
router.get('/chat/canAddUserList', ChatController.canAddUserList)
router.get('/chat/listFriends', ChatController.listFriend)
router.get('/chat/listAddFriendMessage', ChatController.listAddFriendMessage)
router.get('/chat/listHistoryMessages', ChatController.listHistoryMessages)
router.post('/chat/sendAddFriendMessage', ChatController.sendAddFriendMessage)
router.post('/chat/agreeAddFriend', ChatController.agreeAddFriend)



export default router

