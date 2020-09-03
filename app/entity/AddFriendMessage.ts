import { Column, ManyToOne, JoinColumn, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'

@Entity()
export class AddFriendMessage {
    @PrimaryGeneratedColumn()
    id: number
    
    @Column()
    senderId: string
    
    @Column()
    responderId: string
    
    @Column({ default: ''})
    remarks: string

    @Column({ default: false })
    isRead: boolean
    
    
    @Column({ default: 0 })
    status: number
    
    @CreateDateColumn()
    createdDate: Date
    
    @UpdateDateColumn()
    updatedDate: Date
}

