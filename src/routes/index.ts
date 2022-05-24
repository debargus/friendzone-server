import { Router } from 'express'
import auth from './auth'
import post from './post'
import group from './group'
import user from './user'
import { authGuard } from '../middleware/authGuard'
import { getPreSignedUrl } from '../controller/shared'

const router = Router()

router.use(`/auth`, auth)
router.use(`/post`, post)
router.use(`/group`, group)
router.use(`/user`, user)

router.get('/getuploadurl', [authGuard], getPreSignedUrl)

export default router
