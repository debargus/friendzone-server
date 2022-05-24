import { Request, Response, NextFunction } from 'express'

import { User } from '../../entity/user/User'
import { ErrorResponse } from '../../utils/response/errorResponse'
import { db } from '../../db'
import { CreatePostArgs } from '../../entity/post/types'
import { Post } from '../../entity/post/Post'
import { Group } from '../../entity/group/Group'

export const create = async (req: Request, res: Response, next: NextFunction) => {
    const { content, group_id, is_public }: CreatePostArgs = req.body
    const { jwtPayload } = req

    const userRepository = db.getRepository(User)
    const postRepository = db.getRepository(Post)
    const groupRepository = db.getRepository(Group)

    try {
        const user = await userRepository
            .createQueryBuilder('user')
            .where('user.username = :username', { username: jwtPayload.username })
            .getOne()

        if (!user) {
            const customError = new ErrorResponse(404, 'user not found')
            return next(customError)
        }

        const group = await groupRepository
            .createQueryBuilder('group')
            .leftJoinAndSelect('group.members', 'member')
            .where('group.id = :id', { id: group_id })
            .andWhere('member.id = :member_id', { member_id: jwtPayload.id })
            .getOne()

        if (!group) {
            const customError = new ErrorResponse(401, 'create not allowed')
            return next(customError)
        }

        const newPost = new Post()
        newPost.content = content
        newPost.author = user
        newPost.group = group

        if (is_public !== undefined) {
            newPost.is_public = is_public
        }

        try {
            const post = await postRepository.save(newPost)
            res.customSuccess(200, 'post created', { post })
        } catch (err) {
            const customError = new ErrorResponse(500, 'post not created', err)
            return next(customError)
        }
    } catch (err) {
        const customError = new ErrorResponse(500, 'post not created', err)
        return next(customError)
    }
}
