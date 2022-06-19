import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    BaseEntity,
    ManyToMany,
    OneToMany,
    JoinColumn,
    ManyToOne
} from 'typeorm'
import { Message } from '../message/Message'
import { User } from '../user/User'

@Entity()
export class Conversation extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column()
    @CreateDateColumn()
    created_at: Date

    @Column()
    @UpdateDateColumn()
    updated_at: Date

    @Column({ type: 'simple-array' })
    participants_ids: string[]

    @ManyToMany(() => User)
    @JoinColumn({ name: 'participants' })
    participants: User[]

    @OneToMany(() => Message, (message) => message.conversation)
    messages: Message[]

    @ManyToOne(() => User, (user) => user.conversations, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'creator_id' })
    creator: User
}
