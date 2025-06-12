import asyncHandler from "express-async-handler";
import { dbConnection } from "../config/db_config.js";


const db = process.env.DB

//CREATE 
export const createEvent = asyncHandler(async (req, res) => {

    const type = req.userData.type
    // console.log(type);
    if (type == "ADMIN") {


        const { title, date, location, description } = req.body
        if (!title) {
            res.status(400)
            throw new Error("title is required !!")
        }
        if (!date) {
            res.status(400)
            throw new Error("date is required !!")
        }
        if (!location) {
            res.status(400)
            throw new Error("location is required !!")
        }
        if (!description) {
            res.status(400)
            throw new Error("description is required !!")
        }

        const [{ affectedRows }] = await dbConnection.query(
            `INSERT INTO ${db}.events set ?`,
            { title, date, location, description }
        )

        if (affectedRows == 1) {
            res.status(200).json({ status: 200, message: "event created successfully !!" })
        } else {
            res.status(500);
            throw new Error("error in creating events to db occurs..");
        }
    } else {
        res.status(401);
        throw new Error("unauthorized access !!")
    }
})

export const getAllEvents = asyncHandler(async (req, res) => {
    const [rows] = await dbConnection.query(`
        SELECT * FROM ${db}.events`)

    res.status(200).json({ status: 200, message: "event lists", data: rows })
})

export const getSingleEvent = asyncHandler(async (req, res) => {
    const id = req.params.id
    if (!req.params || !id) {
        res.status(400);
        throw new Error("id is required in url");
    }
    const [rows] = await dbConnection.query(`
        SELECT * FROM ${db}.events WHERE id = ?`, id)
    if (rows.length == 0) {
        res.status(404);
        throw new Error("event not found !!");
    } else {
        res.status(200).json({ status: 200, message: "event", data: rows[0] })
    }

})


export const editEvent = asyncHandler(async (req, res) => {
    const id = req.params.id;

    if (!req.params) {
        res.status(400)
        throw new Error("id is required in url !")
    }

    const { title, date, location, description } = req.body

    if (!req.body) {
        res.status(400)
        throw new Error("{ title, date, location, description } is required !!")
    }

    if (!title) {
        res.status(400)
        throw new Error("title is required !!")
    }
    if (!date) {
        res.status(400)
        throw new Error("date is required !!")
    }
    if (!location) {
        res.status(400)
        throw new Error("location is required !!")
    }
    if (!description) {
        res.status(400)
        throw new Error("description is required !!")
    }

    const [rows] = await dbConnection.query(
        `SELECT * FROM ${db}.events WHERE id = ?`,
        id
    )

    if (rows.length == 0) {
        res.status(404)
        throw new Error("event not found !!")
    }

    const [{ affectedRows }] = await dbConnection.query(
        `UPDATE ${db}.events set title = ? ,date = ? , location = ? , description = ?`,
        [title, date, location, description]
    )

    if (affectedRows == 1) {
        res.status(200).json({ status: 200, message: "event successfully updated" })
    } else {
        res.status(500)
        throw new Error("failed to update")
    }
})

export const deleteEvent = asyncHandler(async (req, res) => {
    const id = req.params.id

    if (!req.params || !id) {
        res.status(400)
        throw new Error("id is required in url !")
    }

    const [rows] = await dbConnection.query(
        `SELECT * FROM ${db}.events WHERE id = ?`,
        id
    )

    if (rows.length == 0) {
        res.status(404)
        throw new Error("event not found !!")
    } else {
        const [{ affectedRows }] = await dbConnection.query(
            `DELETE FROM ${db}.events WHERE id = ?`,
            id
        )

        if (affectedRows == 1) {
            res.status(200).json({ status: 200, message: "event successfully deleted" })
        } else {
            res.status(500)
            throw new Error("failed to delete event !")
        }
    }
})