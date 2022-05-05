import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    BaseEntity,
    OneToMany,
    ManyToOne
} from 'typeorm'
import { Downvote } from '../downvote/Downvote'
import { Group } from '../group/Group'
import { Upvote } from '../upvote/Upvote'
import { User } from '../user/User'

@Entity()
export class Post extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column()
    @CreateDateColumn()
    created_at: Date

    @Column()
    @UpdateDateColumn()
    updated_at: Date

    @Column()
    content: string

    @Column()
    author_id: string

    @Column()
    group_id: string

    @Column({ default: 0 })
    upvotes_count: number

    @Column({ default: 0 })
    downvotes_count: number

    @Column({ default: false })
    is_public: boolean

    @ManyToOne(() => User, (user) => user.posts)
    author: User

    @ManyToOne(() => Group, (group) => group.posts)
    group: Group

    @OneToMany(() => Upvote, (upvote) => upvote.post, { onDelete: 'CASCADE' })
    upvotes: Upvote[]

    @OneToMany(() => Downvote, (downvote) => downvote.post, { onDelete: 'CASCADE' })
    downvotes: Downvote[]
}
