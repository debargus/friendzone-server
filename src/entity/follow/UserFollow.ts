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
import { User } from '../user/User'

@Entity()
export class UserFollow extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column()
    @CreateDateColumn()
    created_at: Date

    @Column()
    @UpdateDateColumn()
    updated_at: Date

    @ManyToOne(() => User, (user) => user.followers, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'follower_id' })
    follower: User

    @ManyToOne(() => User, (user) => user.followings, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'following_id' })
    following: User
}
