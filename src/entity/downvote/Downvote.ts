import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    BaseEntity,
    ManyToOne
} from 'typeorm'
import { Post } from '../post/Post'
import { User } from '../user/User'

@Entity()
export class Downvote extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column()
    @CreateDateColumn()
    created_at: Date

    @Column()
    @UpdateDateColumn()
    updated_at: Date

    @Column()
    post_id: string

    @Column()
    author_id: string

    @ManyToOne(() => Post, (post) => post.downvotes)
    post: Post

    @ManyToOne(() => User, (user) => user.downvotes)
    author: User
}
