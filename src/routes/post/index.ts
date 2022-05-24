import { Router } from 'express'

import {
	addHot,
	create,
	deletePost,
	downvote,
	get,
	getAllGroupPosts,
	getAllPublicGroupPosts,
	getPopularPosts,
	getPopularPublicPosts,
	postComment,
	removeHot,
	upvote
} from '../../controller/post'
import { authGuard } from '../../middleware/authGuard'
import { jwtTokenAppend } from '../../middleware/jwtTokenAppend'

const router = Router()

router.get('/all', [authGuard, jwtTokenAppend], getPopularPosts)
router.get('/public', getPopularPublicPosts)
router.get('/:id', [jwtTokenAppend], get)
router.delete('/:id', [authGuard], deletePost)
router.post('/:id/upvote', [authGuard], upvote)
router.post('/:id/downvote', [authGuard], downvote)
router.post('/:id/hot', [authGuard], addHot)
router.delete('/:id/hot', [authGuard], removeHot)
router.get('/group/:id/public', [jwtTokenAppend], getAllPublicGroupPosts)
router.get('/group/:id/all', [authGuard, jwtTokenAppend], getAllGroupPosts)
router.post('/', [authGuard], create)
router.post('/comment', [authGuard], postComment)

export default router
