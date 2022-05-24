import { Router } from 'express'

import { get, me } from '../../controller/user'
import { getUserGroups } from '../../controller/group'
import { authGuard } from '../../middleware/authGuard'
import { jwtTokenAppend } from '../../middleware/jwtTokenAppend'

const router = Router()

router.get('/me', [authGuard], me)
router.get('/:id', get)
router.get('/:id/groups', [jwtTokenAppend], getUserGroups)

export default router
