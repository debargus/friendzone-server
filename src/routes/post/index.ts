import { Router } from 'express'

import {
	addBookmark,
	addHot,
	create,
	deleteComment,
	deletePost,
	downvote,
	get,
	getAllGroupPosts,
	getAllPublicGroupPosts,
	getMyBookmarks,
	getMyPosts,
	getPopularPosts,
	getPopularPublicPosts,
	getUserPosts,
	postComment,
	removeBookmark,
	removeHot,
	update,
	upvote
} from '../../controller/post'
import { authGuard } from '../../middleware/authGuard'
import { jwtTokenAppend } from '../../middleware/jwtTokenAppend'

const router = Router()

router.get('/all', [authGuard, jwtTokenAppend], getPopularPosts)
router.get('/public', getPopularPublicPosts)
router.get('/myposts', [authGuard], getMyPosts)
router.get('/mybookmarks', [authGuard], getMyBookmarks)
router.post('/:id/upvote', [authGuard], upvote)
router.post('/:id/downvote', [authGuard], downvote)
router.post('/:id/hot', [authGuard], addHot)
router.delete('/:id/hot', [authGuard], removeHot)
router.put('/:id/update', [authGuard], update)
router.post('/:id/bookmark', [authGuard], addBookmark)
router.delete('/:id/bookmark', [authGuard], removeBookmark)
router.get('/:id', [jwtTokenAppend], get)
router.delete('/:id', [authGuard], deletePost)
router.get('/user/:user_id', [jwtTokenAppend], getUserPosts)
router.get('/group/:id/public', [jwtTokenAppend], getAllPublicGroupPosts)
router.get('/group/:id/all', [authGuard, jwtTokenAppend], getAllGroupPosts)
router.post('/', [authGuard], create)
router.post('/comment', [authGuard], postComment)
router.delete('/comment/:id', [authGuard], deleteComment)

export default router
