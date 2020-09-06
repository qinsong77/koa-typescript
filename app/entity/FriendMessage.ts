import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'

@Entity()
export class FriendMessage {
    @PrimaryGeneratedColumn()
    id: number
    
    @Column()
    userId: string
    
    @Column()
    friendId: string
    
    @Column()
    content: string;
    
    @Column({ default: 0})
    messageType: Number;
    
    @Column()
    time: Date;
    
    @CreateDateColumn()
    createdDate: Date
    
    @UpdateDateColumn()
    updatedDate: Date
}

