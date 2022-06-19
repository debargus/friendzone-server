import { Request, Response, NextFunction } from 'express'

import { ErrorResponse } from '../../utils/response/errorResponse'
import { db } from '../../db'
import { Group } from '../../entity/group/Group'

export const approveJoin = async (req: Request, res: Response, next: NextFunction) => {
    const { group_id, request_user_id } = req.body
    const { jwtPayload } = req

    const groupRepository = db.getRepository(Group)

    try {
        const group = await groupRepository
            .createQueryBuilder('group')
            .leftJoin('group.admins', 'admin')
            .leftJoinAndSelect('group.members', 'members')
            .leftJoinAndSelect('group.join_requests', 'join_request')
            .where('group.id = :id', { id: group_id })
            .andWhere('admin.id = :admin_id', { admin_id: jwtPayload.id })
            .getOne()

        if (!group) {
            const customError = new ErrorResponse(404, 'group or request not found')
            return next(customError)
        }

        const requestingUserArr = group.join_requests.filter((member) => member.id === request_user_id)

        if (requestingUserArr.length === 0) {
            const customError = new ErrorResponse(404, 'request not found')
            return next(customError)
        }

        const updatedRequests = group.join_requests.filter((member) => member.id !== request_user_id)

        group.members.unshift(requestingUserArr[0])
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
