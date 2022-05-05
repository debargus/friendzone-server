import { Router } from 'express'

import { get, me } from '../../controller/user'
import { authGuard } from '../../middleware/authGuard'

const router = Router()

router.get('/me', [authGuard], me)
router.get('/:id', get)

export default router
