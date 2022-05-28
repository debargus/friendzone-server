import { Request, Response, NextFunction } from 'express'

import { ErrorResponse } from '../../utils/response/errorResponse'
import { db } from '../../db'
import { Group } from '../../entity/group/Group'

export const deleteGroup = async (req: Request, res: Response, next: NextFunction) => {
    const { id: group_id } = req.params
    const { jwtPayload } = req

    const groupRepository = db.getRepository(Group)

    try {
        console.log('object', group_id, jwtPayload)
        const group = await groupRepository
            .createQueryBuilder('group')
            .leftJoin('group.admins', 'admin')
            .where('group.id = :group_id', { group_id })
            .andWhere('admin.id = :admin_id', { admin_id: jwtPayload.id })
            .getOne()

        if (!group) {
            const customError = new ErrorResponse(404, 'group not found')
            return next(customError)
        }

        const deleteResponse = await db
            .createQueryBuilder()
            .delete()
            .from(Group)
            .where('id = :group_id', { group_id })
            .execute()

        if (deleteResponse.affected === 0) {
            const customError = new ErrorResponse(500, 'failed to delete group')
            return next(customError)
        }

        res.customSuccess(200, 'group deleted successfully')
    } catch (err) {
        const customError = new ErrorResponse(500, 'failed to delete group', err)
        return next(customError)
    }
}
