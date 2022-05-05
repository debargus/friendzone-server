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
            .where('group.id = :id', { id: group_id })
            .leftJoinAndSelect('group.join_requests', 'join_requests')
            .addSelect('group.admins')
            .getOne()

        if (!group) {
            const customError = new ErrorResponse(404, 'group not found')
            return next(customError)
        }

        const alreadyJoined = group.join_requests.filter((member) => member.id === user.id)

        if (alreadyJoined.length) {
            const customError = new ErrorResponse(400, 'already sent join request')
            return next(customError)
        }

        if (group.admins.includes(user.id)) {
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
