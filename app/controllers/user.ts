import { Context } from 'koa'
import { getManager } from 'typeorm'

import { User } from '../entity/user'

export default class UserController {
    public static async listUsers(ctx: Context) {
        const userRepository = getManager().getRepository(User)
        const users = await userRepository.find()
        ctx.ok(users)
    }

    public static async showUserDetail(ctx: Context) {
        const userRepository = getManager().getRepository(User)
        const user = await userRepository.findOne(+ctx.params.id)

        if (user) {
            ctx.ok(user)
        } else {
            ctx.NotFoundException()
        }
    }

    public static async updateUser(ctx: Context) {
        const userRepository = getManager().getRepository(User)
        await userRepository.update(+ctx.params.id, ctx.request.body)
        const updatedUser = await userRepository.findOne(+ctx.params.id)

        if (updatedUser) {
            ctx.ok(updatedUser)
        } else {
            ctx.NotFoundException()
        }
    }

    public static async deleteUser(ctx: Context) {
        const userRepository = getManager().getRepository(User)
        await userRepository.delete(+ctx.params.id)

        ctx.ok('删除成功')
    }
}
