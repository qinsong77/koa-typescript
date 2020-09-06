import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'

@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string
    
    @Column()
    name: string
    
    @Column({ select: false })
    password: string
    
    @Column()
    email: string
    
    @Column({ default: '/avatar/default.jpg'})
    avatar: string
    
    @CreateDateColumn()
    createdDate: Date
    
    @UpdateDateColumn()
    updatedDate: Date
}
