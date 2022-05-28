import { Request, Response, NextFunction } from 'express'

import { ErrorResponse } from '../../utils/response/errorResponse'
import { db } from '../../db'
import { UpdateGroupArgs } from '../../entity/group/types'
import { Group } from '../../entity/group/Group'

export const update = async (req: Request, res: Response, next: NextFunction) => {
    const { name, display_image, cover_image, description }: UpdateGroupArgs = req.body
    const { id: group_id } = req.params
    const { jwtPayload } = req

    const groupRepository = db.getRepository(Group)

    try {
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

        const updateObj = {
            ...(name && { name }),
            ...(display_image && { display_image }),
            ...(cover_image && { cover_image }),
            ...(description && { description })
        }

        await db.createQueryBuilder().update(Group).set(updateObj).where('id = :group_id', { group_id }).execute()

        res.customSuccess(200, 'group updated successfully')
    } catch (err) {
        const customError = new ErrorResponse(500, 'failed to update user', err)
        return next(customError)
    }
}
