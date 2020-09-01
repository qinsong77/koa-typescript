import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class userFriend {
    @PrimaryGeneratedColumn()
    id: number
    
    @Column()
    friendId: string
    
    @Column()
    userId: string
}

