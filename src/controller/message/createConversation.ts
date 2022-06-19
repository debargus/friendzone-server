import { Request, Response, NextFunction } from 'express'

import { User } from '../../entity/user/User'
import { ErrorResponse } from '../../utils/response/errorResponse'
import { db } from '../../db'
import { Conversation } from '../../entity/conversation/Conversation'

export const createConversation = async (req: Request, res: Response, next: NextFunction) => {
    const { sender_id, receiver_id } = req.body
    const { jwtPayload } = req

    const conversationRepository = db.getRepository(Conversation)
    const userRepository = db.getRepository(User)

    try {
        const conversation = await conversationRepository
            .createQueryBuilder('conversation')
            .where('conversation.participants_ids @> ARRAY[:...participants_ids]', {
                participants_ids: [sender_id, receiver_id]
            })
            .getOne()

        if (conversation) res.customSuccess(200, 'conversation exists')

        const sender = await userRepository
            .createQueryBuilder('sender')
            .where('sender.id = :sender_id', { sender_id: jwtPayload.id })
            .getOne()

        const receiver = await userRepository
            .createQueryBuilder('receiver')
            .where('receiver.id = :receiver_id', { receiver_id })
            .getOne()

        if (!sender || !receiver) {
            const customError = new ErrorResponse(404, 'sender or receiver not found')
            return next(customError)
        }

        const newConversation = new Conversation()
        newConversation.creator = sender
        newConversation.participants = [sender, receiver]
        newConversation.participants_ids = [sender.id, receiver.id]

        try {
            const conversation = await conversationRepository.save(newConversation)
            res.customSuccess(200, 'conversation created', { conversation })
        } catch (err) {
            const customError = new ErrorResponse(500, 'conversation not created', err)
            return next(customError)
        }
    } catch (err) {
        const customError = new ErrorResponse(500, 'conversation not created', err)
        return next(customError)
    }
}
