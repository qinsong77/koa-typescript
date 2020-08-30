import {Column, Entity, PrimaryGeneratedColumn} from 'typeorm'

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @Column({select: false})
    password: string

    @Column()
    email: string
    
    @Column({type: 'double',default: new Date().valueOf()})
    createAt: number;
}

