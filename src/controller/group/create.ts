import { Request, Response, NextFunction } from 'express'

import { User } from '../../entity/user/User'
import { ErrorResponse } from '../../utils/response/errorResponse'
import { db } from '../../db'
import { Group } from '../../entity/group/Group'
import { CreateGroupArgs } from '../../entity/group/types'

export const create = async (req: Request, res: Response, next: NextFunction) => {
    const { name, description, display_image, cover_image }: CreateGroupArgs = req.body
    const { jwtPayload } = req

    const userRepository = db.getRepository(User)
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

        const newGroup = new Group()
        newGroup.name = name
        newGroup.description = description
        newGroup.display_image = display_image
        newGroup.cover_image = cover_image
        newGroup.members_count = 1
        newGroup.members = [user]
        newGroup.admins = [user.id]

        try {
            await groupRepository.save(newGroup)
            res.customSuccess(200, 'group created successfully')
        } catch (err) {
            const customError = new ErrorResponse(600, 'group not created', err)
            return next(customError)
        }
    } catch (err) {
        const customError = new ErrorResponse(500, 'group not created', err)
        return next(customError)
    }
}
