import { Request, Response, NextFunction } from 'express'

import { ErrorResponse } from '../../utils/response/errorResponse'
import { db } from '../../db'
import { Group } from '../../entity/group/Group'

export const getPopularGroups = async (_: Request, res: Response, next: NextFunction) => {
    const groupRepository = db.getRepository(Group)

    try {
        const groups = await groupRepository
            .createQueryBuilder('group')
            .orderBy('group.members_count', 'DESC')
            .getMany()

        res.customSuccess(200, '', { groups })
    } catch (err) {
        const customError = new ErrorResponse(500, 'failed to get popular groups', err)
        return next(customError)
    }
}
