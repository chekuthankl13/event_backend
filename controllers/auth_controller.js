import asyncHandler from "express-async-handler"
import { dbConnection } from "../config/db_config.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"

const db = process.env.DB

export const register = asyncHandler(async (req, res) => {
    console.log(req.body);

    const { email, password } = req.body;
    console.log(`1`);

    if (!email) {
        res.status(400)
        throw new Error("email is required !!")
    }

    if (!password) {
        res.status(400)
        throw new Error("password is required !!")
    }

    const [rows] = await dbConnection.query(`SELECT * FROM admin_auth WHERE email =?`, email)

    if (rows.length == 0) {
        const hashPsw = await bcrypt.hash(password, 10)
        const formData = { email, password: hashPsw }
        const [{ affectedRows }] = await dbConnection.query(
            `INSERT INTO ${db}.admin_auth set ?`,
            formData
        )

        if (affectedRows == 1) {
            res.status(200).json({ status: 200, message: "successfully registered !!" })
        } else {
            res.status(500)
            throw new Error("some error occured in inserting values to db");
        }
    } else {
        res.status(400)
        throw new Error("This email is already taken !!")
    }
})

export const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    if (!email) {
        res.status(400)
        throw new Error("email is required !!")
    }

    if (!password) {
        res.status(400)
        throw new Error("password is required !!")
    }

    const [rows] = await dbConnection.query(
        `SELECT * FROM ${db}.admin_auth WHERE email = ?`,
        email
    )

    if (rows.length > 0 && (await bcrypt.compare(password, rows[0].password))) {
        const token = jwt.sign(
            { email: rows[0].email, id: rows[0].id, type: "ADMIN" },
            process.env.SECERT_KEY,
            { expiresIn: "2d" }
        )

        res.status(200).json({ status: 200, message: "logged successfull", token })
    } else {
        res.status(400)
        throw new Error("INVALID credentials !")
    }
})


////////////////////////////////////////// USER AUTH ///////////////////////////////////////

export const userLogin = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    if (!email) {
        res.status(400)
        throw new Error("email is required !!")
    }

    if (!password) {
        res.status(400)
        throw new Error("password is required !!")
    }

    const [rows] = await dbConnection.query(
        `SELECT * FROM ${db}.users WHERE email = ?`,
        email
    )

    if (rows.length > 0 && (await bcrypt.compare(password, rows[0].password,))) {
        const token = jwt.sign(
            { email: rows[0].email, id: rows[0].id, type: "USER" },
            process.env.SECERT_KEY,
            { expiresIn: "2d" }
        )
        res.status(200).json({ status: 200, message: "user logggedin successfully", token })
    } else {
        res.status(404)
        throw new Error("Invalid credentials !!");

    }
})

export const userRegister = asyncHandler(async (req, res) => {

    if (!req.body) {
        res.status(400)
        throw new Error("{name,email,phone,password} is required !!")
    }

    const { name, email, phone, password } = req.body

    if (!name) {
        res.status(400)
        throw new Error("name is required !!")
    }

    if (!phone) {
        res.status(400)
        throw new Error("phone is required !!")
    }

    if (!email) {
        res.status(400)
        throw new Error("email is required !!")
    }

    if (!password) {
        res.status(400)
        throw new Error("password is required !!")
    }


    const [rows] = await dbConnection.query(
        `SELECT * FROM ${db}.users WHERE email = ?`,
        email
    )
    console.log("1");

    if (rows.length == 0) {
       

        const hashPsw = await bcrypt.hash(password, 10)
        

        const formData = { name, email, phone, password: hashPsw }
        

        const [{affectedRows}] = await dbConnection.query(
            `INSERT INTO ${db}.users set ?`,
            formData
        )
       

        if (affectedRows == 1) {
            res.status(200).json({ status: 200, message: "user successfully registered !!" })
        } else {
            res.status(500)
            throw new Error("failed to register user !!")
        }

    } else {
        res.status(400)
        throw new Error("user with this email already registered !!")
    }

})

