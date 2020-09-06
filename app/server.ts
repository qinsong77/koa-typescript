import Koa from 'koa'
import  koaStatic from 'koa-static'
import { createConnection } from 'typeorm'
// import bodyParser from 'koa-bodyparser'
import koaBody from 'koa-body'
import jwt from 'koa-jwt'
import IO from 'socket.io'
import auth from './middleware/auth'

import router from './router'
import { JWT_SECRET } from './constants'
import { logger } from './logger'
import CustomResponse from './middleware/custom-response/response'
import socket from './controllers/socket'
import  path from 'path'


createConnection()
    .then(_ => {
        const app = new Koa()
    
        const server = require('http').Server(app.callback())
        const io = IO(server, {
            path: '/socket/chat'
        })
    
        io.use(auth)
        
        socket(io)
    
        // @ts-ignore
        // io.use(jwt({ secret: JWT_SECRET }))
        // io.use((socket, next) => {
        //     console.log('socket.io handshake')
        //     let token = socket.handshake.headers['Authorization'];
        //     console.log('------------')
        //     return next(new Error('authentication error'));
        // });
    
        // app.use(async (ctx, next) => {
        //     ctx.state.io = io;
        //     console.log('io add to ctx.state')
        //     await next()
        // })
        
        
        // @ts-ignore
        app.use(logger())
        app.use(CustomResponse())
        app.use(koaBody({
            multipart:true, // 支持文件上传
            // encoding:'gzip',
            formidable:{
                uploadDir:path.join(__dirname,'static/avatar/'), // 设置文件上传目录
                keepExtensions: true,    // 保持文件的后缀
                maxFieldsSize:2 * 1024 * 1024, // 文件上传大小
                onFileBegin:(name,file) => { // 文件上传前的设置
                    // console.log(`name: ${name}`);
                },
            }
        }))
        app.use(koaStatic(__dirname + '/static'));
    
        app.use(koaStatic(__dirname + '/public'));

        app.use(jwt({ secret: JWT_SECRET }).unless({ path: [/^\/api\/public/] }))

        app.use(router.routes()).use(router.allowedMethods())
    
        server.listen(3000)
        
        console.log(`server is running: http://localhost:3000 `)
    })
    .catch((err: string) => {
        console.error('TypeORM connection error:', err)
    })

