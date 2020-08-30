import Koa from 'koa'
import { createConnection } from 'typeorm'
import bodyParser from 'koa-bodyparser'
import jwt from 'koa-jwt'

import router from './router'
import { JWT_SECRET } from './constants'
import { logger } from './logger'
import CustomResponse  from './middleware/custom-response/response'

createConnection()
    .then(_ => {
        const app = new Koa()

        // @ts-ignore
        app.use(logger())
        app.use(CustomResponse())
        app.use(bodyParser())

        app.use(jwt({ secret: JWT_SECRET }).unless({ path: [/^\/api\/public/] }))

        app.use(router.routes()).use(router.allowedMethods())

        app.listen(3000)
        
        console.log(`server is running: http://localhost:3000 `)
    })
    .catch((err: string) => {
        console.error('TypeORM connection error:', err)
    })

