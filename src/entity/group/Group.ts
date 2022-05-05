import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    BaseEntity,
    OneToMany,
    ManyToMany,
    JoinTable
} from 'typeorm'
import { Post } from '../post/Post'
import { User } from '../user/User'

@Entity()
export class Group extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column()
    @CreateDateColumn({ select: false })
    created_at: Date

    @Column()
    @UpdateDateColumn({ select: false })
    updated_at: Date

    @Column()
    name: string

    @Column({ select: false })
    description: string

    @Column({ nullable: true })
    display_image: string

    @Column({ nullable: true })
    cover_image: string

    @Column({ default: 0 })
    members_count: number

    @Column({ default: 0, select: false })
    join_request_count: number

    @Column({ type: 'simple-array', select: false })
    admins: string[]

    @OneToMany(() => Post, (post) => post.group, { onDelete: 'CASCADE' })
    posts: Post[]

    @ManyToMany(() => User)
    @JoinTable()
    members: User[]

    @ManyToMany(() => User)
    @JoinTable()
    join_requests: User[]
}
