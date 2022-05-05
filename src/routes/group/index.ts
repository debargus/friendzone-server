import { Router } from 'express'

import { approveJoin, create, get, requestJoin, getPopularGroups } from '../../controller/group'
import { authGuard } from '../../middleware/authGuard'

const router = Router()

router.get('/popular', getPopularGroups)
router.get('/:id', get)
router.post('/', [authGuard], create)
router.post('/join', [authGuard], requestJoin)
router.post('/approve', [authGuard], approveJoin)

export default router
