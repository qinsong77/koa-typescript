import { Context, Next } from 'koa'

export function logger() {
    return async (ctx: Context, next: () => Next) => { // next: () => Promise<void>
        const start = Date.now()
        await next()
        const ms = Date.now() - start
        console.log(`${ctx.method} ${decodeURIComponent(ctx.url)} ${ctx.status} - ${ms}ms`)
    }
}
