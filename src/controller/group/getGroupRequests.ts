import { Request, Response, NextFunction } from 'express'

import { ErrorResponse } from '../../utils/response/errorResponse'
import { db } from '../../db'
import { Group } from '../../entity/group/Group'
import { User } from '../../entity/user/User'

export const getGroupRequests = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params
    const { jwtPayload } = req

    const groupRepository = db.getRepository(Group)
    const userRepository = db.getRepository(User)

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
            .leftJoin('group.admins', 'admin')
            .where('group.id = :id', { id })
            .andWhere('admin.id = :admin_id', { admin_id: user.id })
            .leftJoinAndSelect('group.join_requests', 'join_requests')
            .getOne()

        if (!group) {
            const customError = new ErrorResponse(404, 'group requests not found')
            return next(customError)
        }

        res.customSuccess(200, '', { group_requests: group.join_requests })
    } catch (err) {
        const customError = new ErrorResponse(500, 'failed to get group', err)
        return next(customError)
    }
}
