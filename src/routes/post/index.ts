import { Router } from 'express'

import {
	create,
	downvote,
	get,
	getAllGroupPosts,
	getAllPublicGroupPosts,
	getPopularPosts,
	getPopularPublicPosts,
	upvote
} from '../../controller/post'
import { authGuard } from '../../middleware/authGuard'
import { jwtTokenAppend } from '../../middleware/jwtTokenAppend'

const router = Router()

router.get('/all', [authGuard, jwtTokenAppend], getPopularPosts)
router.get('/public', getPopularPublicPosts)
router.get('/:id', [jwtTokenAppend], get)
router.get('/group/:id/public', [jwtTokenAppend], getAllPublicGroupPosts)
router.get('/group/:id/all', [authGuard, jwtTokenAppend], getAllGroupPosts)
router.post('/', [authGuard], create)
router.post('/upvote', [authGuard], upvote)
router.post('/downvote', [authGuard], downvote)

export default router
