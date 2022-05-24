import { Router } from 'express'

import {
	approveJoin,
	create,
	get,
	requestJoin,
	getPopularGroups,
	getGroupRequests,
	declineJoin
} from '../../controller/group'
import { authGuard } from '../../middleware/authGuard'
import { jwtTokenAppend } from '../../middleware/jwtTokenAppend'

const router = Router()

router.get('/popular', getPopularGroups)
router.get('/:id', get)
router.get('/:id/requests', [authGuard, jwtTokenAppend], getGroupRequests)
router.post('/', [authGuard], create)
router.post('/join', [authGuard], requestJoin)
router.post('/approve', [authGuard], approveJoin)
router.post('/decline', [authGuard], declineJoin)

export default router
