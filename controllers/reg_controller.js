import asyncHandler from "express-async-handler";
import { dbConnection } from "../config/db_config.js";

const db = process.env.DB

export const register = asyncHandler(async (req, res) => {

    const user_id = req.userData.id
    console.log(user_id);

    if (!req.body) {
        res.status(400)
        throw new Error("{name,email,phone,event_id} is required")
    }
    console.log("1");

    const { name, email, phone, event_id } = req.body

    if (!name) {
        res.status(400)
        throw new Error("name is required !!")
    }
    if (!email) {
        res.status(400)
        throw new Error("email is required !!")
    }
    if (!phone) {
        res.status(400)
        throw new Error("phone is required !!")
    }


    if (!event_id) {
        res.status(400)
        throw new Error("event_id is required !!")
    }

    const [user] = await dbConnection.query(
        `SELECT * FROM ${db}.users WHERE id = ?`,
        user_id
    )

    const [event] = await dbConnection.query(
        `SELECT * FROM ${db}.events WHERE id = ?`,
        event_id
    )


    if (user.length == 0) {
        res.status(404)
        throw new Error("User not found");

    }

    if (event.length == 0) {
        res.status(404)
        throw new Error("event not found");

    }

    const [existingReg] = await dbConnection.query(
        `SELECT * FROM ${db}.registrations WHERE user_id = ? AND event_id = ?`,
        [user_id, event_id]
    )


    if (existingReg.length > 0) {

        res.status(400)
        throw new Error("user already registerd to this event");

    }


    const [{ affectedRows }] = await dbConnection.query(
        `INSERT INTO ${db}.registrations set ?`,
        { name, email, phone, user_id, event_id }
    )

    if (affectedRows == 1) {
        res.status(200).json({ status: 200, message: "successfully registered to the event" })

    } else {
        res.status(500)
        throw new Error("failed to register the event");

    }

})


export const getRegistered = asyncHandler(async (req, res) => {
    const id = req.userData.id
    console.log("1 ");

    const [rows] = await dbConnection.query(
        `SELECT
            e.id AS event_id,
            e.title AS event_name,
            e.location,
            e.description,
            r.name,
            r.email,
            r.phone
         FROM events e 
         JOIN registrations r ON e.id = r.event_id
         WHERE r.user_id = ?
        `,
        id
    )
    console.log("2");

    res.status(200).json({ status: 200, message: "user registartions", data: rows })
})
