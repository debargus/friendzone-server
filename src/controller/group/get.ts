import { Request, Response, NextFunction } from 'express'

import { ErrorResponse } from '../../utils/response/errorResponse'
import { db } from '../../db'
import { Group } from '../../entity/group/Group'

export const get = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params

    const groupRepository = db.getRepository(Group)

    try {
        const group = await groupRepository
            .createQueryBuilder('group')
            .where('group.id = :id', { id })
            .addSelect('group.description')
            .leftJoinAndSelect('group.members', 'members')
            // .leftJoinAndSelect('group.join_requests', 'join_requests')
            .getOne()

        if (!group) {
            const customError = new ErrorResponse(404, 'group not found')
            return next(customError)
        }

        res.customSuccess(200, '', { group })
    } catch (err) {
        const customError = new ErrorResponse(500, 'failed to get group', err)
        return next(customError)
    }
}
