import { DataSource } from 'typeorm'
import { Bookmark } from '../entity/bookmark/Bookmark'
import { Comment } from '../entity/comment/Comment'
import { Conversation } from '../entity/conversation/Conversation'
import { Downvote } from '../entity/downvote/Downvote'
import { UserFollow } from '../entity/follow/UserFollow'
import { Group } from '../entity/group/Group'
import { Hot } from '../entity/hot/Hot'
import { Message } from '../entity/message/Message'
import { Post } from '../entity/post/Post'
import { Upvote } from '../entity/upvote/Upvote'
import { User } from '../entity/user/User'

export const db = new DataSource({
    type: 'postgres',
    host: process.env.TYPEORM_DB_HOST,
    port: process.env.TYPEORM_DB_PORT as unknown as number,
    username: process.env.TYPEORM_DB_USERNAME,
    password: process.env.TYPEORM_DB_PASSWORD,
    database: process.env.TYPEORM_DB_NAME,
    entities: [User, Post, Upvote, Downvote, Group, Comment, Hot, UserFollow, Conversation, Message, Bookmark],
    logging: process.env.NODE_ENV !== 'production' && true,
    synchronize: process.env.NODE_ENV !== 'production' && true
})

export const dbConnection = db
    .initialize()
    .then((source) => {
        console.log('Database ' + source.options.database + ' has been initialized!')
    })
    .catch((err) => {
        console.error('Error during Data Source initialization:', err)
    })
