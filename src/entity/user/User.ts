import bcrypt from 'bcrypt'
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    BaseEntity,
    OneToMany
} from 'typeorm'
import { Downvote } from '../downvote/Downvote'
import { Post } from '../post/Post'
import { Upvote } from '../upvote/Upvote'
import { Comment } from '../comment/Comment'
import { Hot } from '../hot/Hot'

@Entity()
export class User extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column()
    @CreateDateColumn({ select: false })
    created_at: Date

    @Column()
    @UpdateDateColumn({ select: false })
    updated_at: Date

    @Column({ unique: true, select: false })
    email: string

    @Column({ default: false, select: false })
    email_verified: string

    @Column({ unique: true })
    username: string

    @Column({ select: false })
    password: string

    @Column()
    name: string

    @Column({ nullable: true })
    avatar: string

    @OneToMany(() => Post, (post) => post.author)
    posts: Post[]

    @OneToMany(() => Upvote, (upvote) => upvote.author)
    upvotes: Upvote[]

    @OneToMany(() => Downvote, (downvotes) => downvotes.author)
    downvotes: Downvote[]

    @OneToMany(() => Comment, (comment) => comment.author)
    comments: Comment[]

    @OneToMany(() => Hot, (hot) => hot.post)
    hots: Hot[]

    saveHashedPassword(password: string) {
        this.password = bcrypt.hashSync(password, 8)
    }

    checkIfPasswordMatch(unencryptedPassword: string) {
        return bcrypt.compareSync(unencryptedPassword, this.password)
    }
}
