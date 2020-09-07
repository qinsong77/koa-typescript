import { Context } from 'koa'
import { getManager, getRepository } from 'typeorm'

import { User } from '../entity/user'
export default class UserController {
    public static async UsersList(ctx: Context) {
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

    public static async getUserDetail(ctx: Context) {
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
        await userRepository.update(ctx.params.id, {
            name: ctx.request.body.name,
            avatar: ctx.request.body.avatar
        })
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
    
    public static async uploadFile(ctx: Context) {
        // @ts-ignore
        const file = ctx.request.files.file
        const avatar = '/avatar/' + file.path.split('\\')[file.path.split('\\').length -1]
        ctx.ok(avatar)
    }
}
