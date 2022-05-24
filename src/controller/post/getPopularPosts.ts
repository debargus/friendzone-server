import { Request, Response, NextFunction } from 'express'

import { ErrorResponse } from '../../utils/response/errorResponse'
import { db } from '../../db'
import { Post } from '../../entity/post/Post'
import { Group } from '../../entity/group/Group'

export const getPopularPosts = async (req: Request, res: Response, next: NextFunction) => {
    const { jwtPayload } = req

    const groupRepository = db.getRepository(Group)
    const postRepository = db.getRepository(Post)

    try {
        const userGroups = await groupRepository
            .createQueryBuilder('group')
            .leftJoinAndSelect('group.members', 'member')
            .where('member.id = :member_id', { member_id: jwtPayload.id })
            .getMany()

        const userGroupIds = userGroups.map((group) => group.id)

        if (userGroupIds.length) {
            const posts = await postRepository
                .createQueryBuilder('post')
                .orderBy('post.created_at', 'DESC')
                .where('post.is_public = :is_public', { is_public: true })
                .orWhere('post.group_id IN (:...group_ids)', { group_ids: userGroupIds })
                .leftJoinAndSelect('post.author', 'author')
                .leftJoinAndSelect('post.group', 'group')
                .loadRelationCountAndMap('post.comments_count', 'post.comments', 'comments_count')
                .getMany()

            res.customSuccess(200, '', { posts })
        } else {
            const posts = await postRepository
                .createQueryBuilder('post')
                .orderBy('post.created_at', 'DESC')
                .andWhere('post.is_public = :is_public', { is_public: true })
                .leftJoinAndSelect('post.author', 'author')
                .leftJoinAndSelect('post.group', 'group')
                .loadRelationCountAndMap('post.comments_count', 'post.comments', 'comments_count')
                .getMany()

            res.customSuccess(200, '', { posts })
        }
    } catch (err) {
        const customError = new ErrorResponse(500, 'failed to get post', err)
        return next(customError)
    }
}
