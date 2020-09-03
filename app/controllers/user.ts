import { Context } from 'koa'
import { getManager, getRepository } from 'typeorm'

import { User } from '../entity/user'
import { AddFriendMessage } from '../entity/AddFriendMessage'
import { UserFriend } from '../entity/UserFriend'

export default class UserController {
    public static async listUsers(ctx: Context) {
        const { current = 1, pageSize = 10, name = '' } = ctx.request.query
        const skip = (current - 1) * pageSize
        const users = await getManager()
            .getRepository(User)
            .createQueryBuilder("user")
            .where("user.name LIKE :param")
            .setParameters({
                param: '%'+name+'%'
            })
            .skip(skip)
            .take(pageSize)
            .getManyAndCount()
    
        async function delay(time: number) {
            return new Promise(function(resolve, reject) {
                setTimeout(function(){
                    resolve();
                }, time);
            });
        }
        await delay(1000)
        const [data, total] = users
        ctx.ok({
            data,
            total,
            current,
            pageSize
        })
    }

    public static async showUserDetail(ctx: Context) {
        const userRepository = getManager().getRepository(User)
        const user = await userRepository.findOne(ctx.params.id)

        if (user) {
            ctx.ok(user)
        } else {
            ctx.NotFoundException()
        }
    }

    public static async updateUser(ctx: Context) {
        const userRepository = getManager().getRepository(User)
        await userRepository.update(ctx.params.id, ctx.request.body)
        const updatedUser = await userRepository.findOne(ctx.params.id)

        if (updatedUser) {
            ctx.ok(updatedUser)
        } else {
            ctx.NotFoundException()
        }
    }

    public static async deleteUser(ctx: Context) {
        const userRepository = getManager().getRepository(User)
        await userRepository.delete(ctx.params.id)

        ctx.ok('删除成功')
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
    
    public static async listAddMessage(ctx: Context) {
    
        const responder = await getRepository(User).findOne(ctx.state.user.id)
        
        const { current = 1, pageSize = 10} = ctx.request.query
        console.log(ctx.request.query)
        const skip = (current - 1) * pageSize
        const msg = await getManager()
            .getRepository(AddFriendMessage)
            .createQueryBuilder("add_friend_message")
            // .leftJoinAndSelect(User, "user", "user.id = add_friend_message.id")
            // .leftJoinAndSelect("add_friend_message.sender", "sender", "sender.id = :id", { id: ctx.state.user.id })
            // .leftJoinAndSelect("add_friend_message.sender", "sender")
            .where("add_friend_message.responderId=:responderId", { responderId: ctx.state.user.id })
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
    
    
    public static async addFriendAgree(ctx: Context) {
        
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
    
    public static async listFriend (ctx: Context) {
        const { current = 1, pageSize = 100, name = '' } = ctx.request.query
        const skip = (current - 1) * pageSize
        const users = await getRepository(UserFriend)
            .createQueryBuilder("user_friend")
            .where("user_friend.userId=:userId", { userId: ctx.state.user.id })
            .leftJoinAndMapOne('user_friend.friend', User, 'user', 'user_friend.userId=user.id')
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
