import { Router } from 'express'

import { createConversation } from '../../controller/message'
import { authGuard } from '../../middleware/authGuard'

const router = Router()

router.post('/create', [authGuard], createConversation)

export default router
