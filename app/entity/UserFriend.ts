import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class UserFriend {
    @PrimaryGeneratedColumn()
    id: number
    
    @Column()
    friendId: string
    
    @Column()
    userId: string
}

