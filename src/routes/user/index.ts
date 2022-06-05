import { Router } from 'express'

import { follow, get, getMyProfile, getPopularUsers, getUserById, unfollow, update } from '../../controller/user'
import { getUserGroups } from '../../controller/group'
import { authGuard } from '../../middleware/authGuard'
import { jwtTokenAppend } from '../../middleware/jwtTokenAppend'

const router = Router()

router.get('/me', [authGuard], getMyProfile)
router.put('/me/update', [authGuard], update)
router.get('/popular', getPopularUsers)
router.get('/:id', get)
router.get('/id/:id', getUserById)
router.get('/:id/groups', [jwtTokenAppend], getUserGroups)
router.post('/:id/follow', [authGuard], follow)
router.post('/:id/unfollow', [authGuard], unfollow)

export default router
