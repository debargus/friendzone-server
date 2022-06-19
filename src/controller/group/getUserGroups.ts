import { Request, Response, NextFunction } from 'express'

import { ErrorResponse } from '../../utils/response/errorResponse'
import { db } from '../../db'
import { Group } from '../../entity/group/Group'
import { User } from '../../entity/user/User'

export const getUserGroups = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params
    const { jwtPayload } = req

    const userRepository = db.getRepository(User)
    const groupRepository = db.getRepository(Group)

    try {
        const user = await userRepository.createQueryBuilder('user').where('user.id = :id', { id }).getOne()

        if (!user) {
            const customError = new ErrorResponse(404, 'user not found')
            return next(customError)
        }

        const userGroups = await groupRepository
            .createQueryBuilder('group')
            .leftJoin('group.members', 'member')
            .where('member.id = :member_id', { member_id: id })
            .getMany()

        let requestedGroups: Group[] = []

        if (jwtPayload?.id) {
            const requests = await groupRepository
                .createQueryBuilder('group')
                .leftJoin('group.join_requests', 'join_request')
                .where('join_request.id = :id', { id: jwtPayload.id })
                .getMany()

            requestedGroups = requests
        }

        res.customSuccess(200, '', { groups: userGroups, requests: requestedGroups })
    } catch (err) {
        const customError = new ErrorResponse(500, 'failed to get groups', err)
        return next(customError)
    }
}
