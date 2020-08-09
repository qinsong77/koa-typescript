import { DefaultContext } from 'koa'
import * as koa from 'koa'
declare module 'koa' {
    interface DefaultContext {
        ok: (data?: object | string) => void
        NotFoundException: (msg?: object | string) => void
        UnauthorizedException: (msg?: object | string) => void
        ForbiddenException: (msg?: object | string) => void
        ErrorHandleRequest: (msg?: object | string) => void
    }
}
