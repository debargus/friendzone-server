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
import { Post } from '../post/Post'
import { User } from '../user/User'

@Entity()
export class Upvote extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column()
    @CreateDateColumn()
    created_at: Date

    @Column()
    @UpdateDateColumn()
    updated_at: Date

    @ManyToOne(() => Post, (post) => post.upvotes, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'post_id' })
    post: Post

    @ManyToOne(() => User, (user) => user.upvotes, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'author_id' })
    author: User
}
