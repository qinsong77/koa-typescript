import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm'

@Entity()
export class UserFriend {
    @PrimaryGeneratedColumn()
    id: number
    
    @Column()
    friendId: string
    
    @Column()
    userId: string
    
    @CreateDateColumn()
    createdDate: Date
    
    @UpdateDateColumn()
    updatedDate: Date
}

