import express from "express";
import { tokenValidation } from "../middleware/token_validation.js";
import { getRegistered, register } from "../controllers/reg_controller.js";

const router = express.Router()

router.use(tokenValidation)

router.route("/register").post(register).get(getRegistered)

export default router