import { Request, Response, NextFunction } from 'express'

import { ErrorResponse } from '../../utils/response/errorResponse'
import { db } from '../../db'
import { Post } from '../../entity/post/Post'

export const getAllGroupPosts = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params
    const { jwtPayload } = req

    const postRepository = db.getRepository(Post)

    try {
        const posts = await postRepository
            .createQueryBuilder('post')
            .orderBy('post.created_at', 'DESC')
            .innerJoinAndSelect('post.author', 'author')
            .innerJoinAndSelect('post.group', 'group')
            .innerJoinAndSelect('group.members', 'member')
            .leftJoinAndMapOne('post.my_upvote', 'post.upvotes', 'upvote', 'upvote.author_id = :author_id', {
                author_id: jwtPayload?.id
            })
            .leftJoinAndMapOne('post.my_downvote', 'post.downvotes', 'downvote', 'downvote.author_id = :author_id', {
                author_id: jwtPayload?.id
            })
            .leftJoinAndMapOne('post.my_hot', 'post.hots', 'hot', 'hot.author_id = :author_id', {
                author_id: jwtPayload?.id
            })
            .leftJoinAndMapOne('post.my_bookmark', 'post.bookmarks', 'bookmark', 'bookmark.author_id = :author_id', {
                author_id: jwtPayload?.id
            })
            .where('post.group_id = :group_id', { group_id: id })
            .andWhere('member.id = :member_id', { member_id: jwtPayload.id })
            .getMany()

        if (posts.length) {
            res.customSuccess(200, '', { posts })
        }

        const publicPosts = await postRepository
            .createQueryBuilder('post')
            .orderBy('post.created_at', 'DESC')
            .where('post.group_id = :group_id', { group_id: id })
            .andWhere('post.is_public = :is_public', { is_public: true })
            .innerJoinAndSelect('post.author', 'author')
            .innerJoinAndSelect('post.group', 'group')
            .leftJoinAndMapOne('post.my_upvote', 'post.upvotes', 'upvote', 'upvote.author_id = :author_id', {
                author_id: jwtPayload?.id
            })
            .leftJoinAndMapOne('post.my_downvote', 'post.downvotes', 'downvote', 'downvote.author_id = :author_id', {
                author_id: jwtPayload?.id
            })
            .leftJoinAndMapOne('post.my_hot', 'post.hots', 'hot', 'hot.author_id = :author_id', {
                author_id: jwtPayload?.id
            })
            .leftJoinAndMapOne('post.my_bookmark', 'post.bookmarks', 'bookmark', 'bookmark.author_id = :author_id', {
                author_id: jwtPayload?.id
            })
            .getMany()

        res.customSuccess(200, '', { posts: publicPosts })
    } catch (err) {
        const customError = new ErrorResponse(500, 'failed to get group posts', err)
        return next(customError)
    }
}
