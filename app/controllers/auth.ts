import { Context } from 'koa'
import * as argon2 from 'argon2'
import { getManager } from 'typeorm'
import jwt from 'jsonwebtoken'
import { JWT_SECRET } from '../constants'

import { User } from '../entity/user'

export default class AuthController {
    public static async login(ctx: Context) {
        const userRepository = getManager().getRepository(User)

        const user = await userRepository
            .createQueryBuilder()
            .where({ name: ctx.request.body.username })
            .addSelect('User.password')
            .getOne()
        if (!user) {
            ctx.NotFoundException('用户名不存在')
        } else if (await argon2.verify(user.password, ctx.request.body.password)) {
            ctx.ok({ token: jwt.sign({ id: user.id }, JWT_SECRET), ctx: ctx })
        } else {
            ctx.ErrorHandleRequest('密码错误')
        }
    }


    public static async register(ctx: Context) {
        const userRepository = getManager().getRepository(User)

        const newUser = new User()
        newUser.name = ctx.request.body.username
        newUser.email = ctx.request.body.email
        newUser.password = await argon2.hash(ctx.request.body.password)

        // 保存到数据库
        const user = await userRepository.save(newUser)

       if (user) {
           ctx.ok(user)
       } else ctx.ErrorHandleRequest('注册失败')
    }
}
