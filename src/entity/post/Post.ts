import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    BaseEntity,
    OneToMany,
    ManyToOne,
    JoinColumn
} from 'typeorm'
import { Bookmark } from '../bookmark/Bookmark'
import { Comment } from '../comment/Comment'
import { Downvote } from '../downvote/Downvote'
import { Group } from '../group/Group'
import { Hot } from '../hot/Hot'
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

    @Column({ default: 0 })
    upvotes_count: number

    @Column({ default: 0 })
    downvotes_count: number

    @Column({ default: 0 })
    comments_count: number

    @Column({ default: 0 })
    hots_count: number

    @Column({ default: false })
    is_public: boolean

    @Column({ default: false })
    is_updated: boolean

    @ManyToOne(() => User, (user) => user.posts, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'author_id' })
    author: User

    @ManyToOne(() => Group, (group) => group.posts, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'group_id' })
    group: Group

    @OneToMany(() => Upvote, (upvote) => upvote.post)
    upvotes: Upvote[]

    @OneToMany(() => Downvote, (downvote) => downvote.post)
    downvotes: Downvote[]

    @OneToMany(() => Comment, (comment) => comment.post)
    comments: Comment[]

    @OneToMany(() => Hot, (hot) => hot.post)
    hots: Hot[]

    @OneToMany(() => Bookmark, (bookmark) => bookmark.post)
    bookmarks: Bookmark[]
}
