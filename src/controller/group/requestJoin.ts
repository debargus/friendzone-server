import { Request, Response, NextFunction } from 'express'

import { ErrorResponse } from '../../utils/response/errorResponse'
import { db } from '../../db'
import { Group } from '../../entity/group/Group'
import { User } from '../../entity/user/User'

export const requestJoin = async (req: Request, res: Response, next: NextFunction) => {
    const { group_id } = req.body
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

        const group = await groupRepository
            .createQueryBuilder('group')
            .leftJoinAndSelect('group.join_requests', 'join_requests')
            .leftJoinAndSelect('group.admins', 'admin')
            .where('group.id = :id', { id: group_id })
            .getOne()

        if (!group) {
            const customError = new ErrorResponse(404, 'group not found')
            return next(customError)
        }

        const isAdmin = group.admins.filter((user) => user.id === jwtPayload.id)

        if (isAdmin.length) {
            const customError = new ErrorResponse(400, 'already a member')
            return next(customError)
        }

        const updatedRequests = [...group.join_requests, user]
        group.join_requests = updatedRequests
        group.join_request_count = updatedRequests.length

        try {
            await groupRepository.save(group)
            res.customSuccess(200, 'user request sent')
        } catch (err) {
            const customError = new ErrorResponse(500, 'request send failed', err)
            return next(customError)
        }
    } catch (err) {
        const customError = new ErrorResponse(500, 'request send failed', err)
        return next(customError)
    }
}
