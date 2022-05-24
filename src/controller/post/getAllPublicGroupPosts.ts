import { Request, Response, NextFunction } from 'express'

import { ErrorResponse } from '../../utils/response/errorResponse'
import { db } from '../../db'
import { Post } from '../../entity/post/Post'

export const getAllPublicGroupPosts = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params

    const postRepository = db.getRepository(Post)

    try {
        const posts = await postRepository
            .createQueryBuilder('post')
            .orderBy('post.created_at', 'DESC')
            .where('post.group_id = :group_id', { group_id: id })
            .andWhere('post.is_public = :is_public', { is_public: true })
            .innerJoinAndSelect('post.author', 'author')
            .innerJoinAndSelect('post.group', 'group')
            .loadRelationCountAndMap('post.comments_count', 'post.comments', 'comments_count')
            .getMany()

        res.customSuccess(200, '', { posts })
    } catch (err) {
        const customError = new ErrorResponse(500, 'failed to get group posts', err)
        return next(customError)
    }
}
