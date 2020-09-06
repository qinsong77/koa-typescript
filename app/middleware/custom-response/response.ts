import { Context, Next } from 'koa'
import { HTTP_CODE } from './code'

import { NotFoundException, UnAuthorizedException, ForbiddenException, ErrorHandleRequest } from './exceptions'


const ok = (ctx: Context) => (data?: object | string ): void => { // 返回一个函数
    ctx.status = HTTP_CODE.OK
    ctx.body = {
        code: 200,
        message: 'success',
        data
    }
}


const KoaCustomResponse = () => async (ctx: Context, next: Next) => {
    ctx.ok = ok(ctx)
    ctx.NotFoundException = (msg?: string) => {
        throw new NotFoundException(msg)
    }
    ctx.UnAuthorizedException = (msg?: string) => {
        throw new UnAuthorizedException(msg)
    }
    ctx.ForbiddenException = (msg?: string) => {
        throw new ForbiddenException(msg)
    }
    ctx.ErrorHandleRequest = (msg?: string) => {
        throw new ErrorHandleRequest(msg)
    }
    try {
        await next()
    } catch (err) {
        console.log(`${ctx.request.url} has error:`)
        console.log('------------------------------')
        console.log(err)
        if (err.name === 'UnauthorizedError') {
            err.message = '请登录'
        }
        ctx.status = err.status || 500
        ctx.body = {
            code: err.status,
            message: err.message
        }
    }

}

export default KoaCustomResponse
