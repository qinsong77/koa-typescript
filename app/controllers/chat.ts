import { Context } from 'koa'
import { getManager, getRepository } from 'typeorm'

import { User } from '../entity/user'
import { AddFriendMessage } from '../entity/AddFriendMessage'
import { UserFriend } from '../entity/UserFriend'
import { FriendMessage } from '../entity/FriendMessage'

export default class ChatController {
    
    public static async canAddUserList(ctx: Context) {
    
        const friends = await getRepository(UserFriend)
            .createQueryBuilder('user_friend')
            .where("user_friend.userId = :userId", { userId: ctx.state.user.id })
            .getMany()
        console.log(friends)
        const friendIds = friends.map( v => v.friendId)
        console.log(friendIds)
        const { current = 1, pageSize = 10, name = '' } = ctx.request.query
        const skip = (current - 1) * pageSize
        const msg = await getManager()
            .getRepository(User)
            .createQueryBuilder('user')
            .whereInIds(friendIds)
            .andWhere("user.id != :id", { id: ctx.state.user.id })// 排除自己
            .andWhere('user.name LIKE :param')
            .setParameters({
                param: '%' + name + '%'
            })
            .select(["user.id", "user.name"])
            .skip(skip)
            .take(pageSize)
            .getManyAndCount()
        
        const [data, total] = msg
        // data.forEach(v => {
        //     // @ts-ignore
        //     v.sender = {// @ts-ignore
        //         name: v.sender.name, // @ts-ignore
        //         id: v.sender.id,// @ts-ignore
        //         avatar: v.sender.avatar
        //     }
        // })
        ctx.ok({
            data,
            total,
            current,
            pageSize
        })
    }
    
    public static async sendAddFriendMessage(ctx: Context) {
        
        const Repository = getRepository(AddFriendMessage)
        
        const responder = await getRepository(User).findOne(ctx.request.body.responder)
        
        const addMes = new AddFriendMessage()
        
        if (responder) {
            addMes.responderId = responder.id
        } else ctx.ErrorHandleRequest('好友不存在！')
        addMes.senderId = ctx.state.user.id
        addMes.remarks = ctx.request.body.remarks
        
        const mes = await Repository.save(addMes)
        
        if (mes) {
            ctx.ok(mes)
        } else ctx.ErrorHandleRequest('发送好友请求失败')
    }
    
    public static async listAddFriendMessage(ctx: Context) {
        
        const { current = 1, pageSize = 10 } = ctx.request.query
        const skip = (current - 1) * pageSize
        const msg = await getManager()
            .getRepository(AddFriendMessage)
            .createQueryBuilder('add_friend_message')
            // .leftJoinAndSelect(User, "user", "user.id = add_friend_message.id")
            // .leftJoinAndSelect("add_friend_message.sender", "sender", "sender.id = :id", { id: ctx.state.user.id })
            // .leftJoinAndSelect("add_friend_message.sender", "sender")
            .where('add_friend_message.responderId=:responderId', { responderId: ctx.state.user.id })
            .leftJoinAndMapOne('add_friend_message.sender', User, 'user', 'add_friend_message.senderId=user.id')
            // .select(["user.id", "user.name"])
            // .leftJoinAndSelect("add_friend_message.responder", "responder")
            // .where("add_friend_message.responder: responder", { responder:responder })
            .skip(skip)
            .take(pageSize)
            .getManyAndCount()
        
        const [data, total] = msg
        data.forEach(v => {
            // @ts-ignore
            v.sender = {// @ts-ignore
                name: v.sender.name, // @ts-ignore
                id: v.sender.id,// @ts-ignore
                avatar: v.sender.avatar
            }
        })
        ctx.ok({
            data,
            total,
            current,
            pageSize
        })
    }
    
    
    public static async agreeAddFriend(ctx: Context) {
        
        const re = getRepository(UserFriend)
        
        const msg = await getRepository(AddFriendMessage).findOne(ctx.request.body.msgId)
        
        
        if (msg) {
            // const sender = await userRepository.findOne(msg.senderId)
            // const responder = await userRepository.findOne(msg.responderId)
            const userFriend = new UserFriend()
            userFriend.friendId = msg.senderId
            userFriend.userId = msg.responderId
            
            const userFriend2 = new UserFriend()
            userFriend2.friendId = msg.responderId
            userFriend2.userId = msg.senderId
            await re.save(userFriend)
            await re.save(userFriend2)
            
            msg.status = 1
            
            await getRepository(AddFriendMessage).save(msg)
            
            ctx.ok('已添加好友')
        } else {
            ctx.ErrorHandleRequest('添加失败！')
        }
    }
    
    public static async listFriend(ctx: Context) {
        const { current = 1, pageSize = 100, name = '' } = ctx.request.query
        const skip = (current - 1) * pageSize
        const users = await getRepository(UserFriend)
            .createQueryBuilder('user_friend')
            .where('user_friend.userId=:userId', { userId: ctx.state.user.id })
            .leftJoinAndMapOne('user_friend.friend', User, 'user', 'user_friend.friendId=user.id')
            .skip(skip)
            .take(pageSize)
            .getManyAndCount()
        
        
        const [data, total] = users
        ctx.ok({
            data,
            total,
            current,
            pageSize
        })
    }
    
    public static async listHistoryMessages(ctx: Context) {
        const { current = 1, pageSize = 100, name = '' } = ctx.request.query
        const skip = (current - 1) * pageSize
        const users = await getRepository(FriendMessage)
            .createQueryBuilder('friend_message')
            .where('friend_message.userId=:userId', { userId: ctx.state.user.id })
            .orWhere('friend_message.friendId=:userId', { userId: ctx.state.user.id })
            .orderBy('friend_message.createdDate', 'DESC')
            .skip(skip)
            .take(pageSize)
            .getManyAndCount()
        
        
        const [data, total] = users
        ctx.ok({
            data,
            total,
            current,
            pageSize
        })
    }
}
