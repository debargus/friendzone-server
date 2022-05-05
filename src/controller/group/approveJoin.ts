import { Request, Response, NextFunction } from 'express'

import { ErrorResponse } from '../../utils/response/errorResponse'
import { db } from '../../db'
import { Group } from '../../entity/group/Group'
import { User } from '../../entity/user/User'

export const approveJoin = async (req: Request, res: Response, next: NextFunction) => {
    const { group_id, request_user_id } = req.body
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
            .addSelect('group.admins')
            .leftJoinAndSelect('group.members', 'members')
            .leftJoinAndSelect('group.join_requests', 'join_requests')
            .getOne()

        if (!group) {
            const customError = new ErrorResponse(404, 'group not found')
            return next(customError)
        }

        if (!group.admins.includes(jwtPayload.id)) {
            const customError = new ErrorResponse(401, 'request approval not allowed')
            return next(customError)
        }

        const requestExists = group.join_requests.filter((request) => request.id === request_user_id)

        if (!requestExists.length) {
            const customError = new ErrorResponse(404, 'request not found')
            return next(customError)
        }

        const requestingUser = await userRepository
            .createQueryBuilder('user')
            .where('user.id = :id', { id: request_user_id })
            .getOne()

        if (!requestingUser) {
            const customError = new ErrorResponse(404, 'requesting user not found')
            return next(customError)
        }

        group.members.unshift(requestingUser)
        const updatedRequests = group.join_requests.filter((member) => member.id !== request_user_id)
        group.join_requests = updatedRequests
        group.join_request_count = updatedRequests.length
        group.members_count = group.members.length

        try {
            await groupRepository.save(group)
            res.customSuccess(200, 'user request approved')
        } catch (err) {
            const customError = new ErrorResponse(500, 'group approval failed')
            return next(customError)
        }
    } catch (err) {
        const customError = new ErrorResponse(500, 'group approval failed', err)
        return next(customError)
    }
}
