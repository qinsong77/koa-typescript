import { Server } from 'socket.io'
import { FriendMessage } from '../entity/FriendMessage'
import { getRepository } from 'typeorm'
import { AddFriendMessage } from '../entity/AddFriendMessage'
let MAP = {};
interface Msg {
    type: number,
    content: string,
    friendId: string,
    time: Date,
    uid?: string
}
interface AddFriendData {
    responder: string,
    remarks: string
}
function socket(io: Server) {
    //两人聊天
    io.on('connection', (socket) => {
        // @ts-ignore
        MAP[socket.user.id] = socket.id
    
        socket.on('send', async (msg: Msg) => {
            console.log(msg)
            const { friendId } = msg
            // @ts-ignore
            const friend_socket_id = MAP[friendId];//接收用户socket.id
            // @ts-ignore
            const uid = socket.user.id; //发送用户id
        
            if (friend_socket_id) { // 好友在线则发送
                msg.friendId = uid // 发送时转换id
                msg.uid = friendId
                socket.to(friend_socket_id).emit('reply', msg);
            }
            // 给自己也发一份
            // socket.emit('reply', { id: uid, self: true }, { date: currTime(), msg });
            // 保存数据库
            try {
                const friendMessage = new FriendMessage()
                friendMessage.userId = uid
                friendMessage.friendId = friendId
                friendMessage.content = msg.content
                friendMessage.messageType = msg.type
                friendMessage.time = msg.time
                await getRepository(FriendMessage).save(friendMessage)
            } catch (err) {
                console.error(err)
            }
        })
        
        socket.on('add_friend', async (data: AddFriendData) => {
            const Repository = getRepository(AddFriendMessage)
            const addMes = new AddFriendMessage()
            // @ts-ignore
            addMes.senderId = socket.user.id
            addMes.responderId = data.responder
            addMes.remarks = data.remarks
            const mes = await Repository.save(addMes)
            socket.to(addMes.responderId).emit('new_add_msg', mes);
        })
    })
    
}

export default socket
