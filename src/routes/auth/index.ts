import { Router } from 'express'

import { login, logout, register } from '../../controller/auth'
import { authGuard } from '../../middleware/authGuard'

const router = Router()

router.post('/register', register)
router.post('/login', login)
router.post('/logout', [authGuard], logout)

export default router
