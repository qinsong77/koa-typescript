import { Column, ManyToOne, JoinColumn, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'
import { User } from './user'

@Entity()
export class AddFriendMessage {
    @PrimaryGeneratedColumn()
    id: number
    
    @ManyToOne(type => User)
    sender: User
    
    @ManyToOne(type => User)
    responder: User
    
    @Column({ default: ''})
    remarks: string

    @Column({ default: false })
    isRead: boolean
    
    
    @Column({ default: false })
    isReject: boolean
    
    @CreateDateColumn()
    createdDate: Date
    
    @UpdateDateColumn()
    updatedDate: Date
}

