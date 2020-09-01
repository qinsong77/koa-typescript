import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'

@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: number
    
    @Column()
    name: string
    
    @Column({ select: false })
    password: string
    
    @Column()
    email: string
    
    @CreateDateColumn()
    createdDate: Date
    
    @UpdateDateColumn()
    updatedDate: Date
}
