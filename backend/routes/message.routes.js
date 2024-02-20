import { Router } from "express"
import protectRoute from '../middleware/protectRoute.js'
import { sendMessage, getMessage } from "../controllers/message.controller.js"
const router = Router()

router.get("/:id",protectRoute,getMessage)
router.post("/send/:id",protectRoute,sendMessage)


export default router