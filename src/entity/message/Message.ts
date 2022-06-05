import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    BaseEntity,
    ManyToOne,
    JoinColumn
} from 'typeorm'
import { Conversation } from '../conversation/Conversation'
import { User } from '../user/User'

@Entity()
export class Message extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column()
    @CreateDateColumn()
    created_at: Date

    @Column()
    @UpdateDateColumn()
    updated_at: Date

    @Column()
    text_content: string

    @ManyToOne(() => Conversation, (conversation) => conversation.messages, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'conversation_id' })
    conversation: Conversation

    @ManyToOne(() => User, (user) => user.messages, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'sender_id' })
    sender: User

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    timestamp: Date
}
