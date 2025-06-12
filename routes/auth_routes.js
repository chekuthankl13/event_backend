import express from "express";
import { login, register, userLogin, userRegister } from "../controllers/auth_controller.js"

export const router = express.Router();

router.route("/admin/register").post(register)
router.route("/admin/login").post(login)

router.route("/user/login").post(userLogin)
router.route("/user/register").post(userRegister)