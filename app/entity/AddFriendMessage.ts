import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'

@Entity()
export class AddFriendMessage {
    @PrimaryGeneratedColumn()
    id: number
    
    @Column()
    sender: string
    
    @Column()
    responder: string
    
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

