import { Router } from 'express'
import auth from './auth'
import post from './post'
import group from './group'
import user from './user'

const router = Router()

router.use(`/auth`, auth)
router.use(`/post`, post)
router.use(`/group`, group)
router.use(`/user`, user)

export default router
