import { dbConnection } from "./db_config.js"
import asyncHandler from "express-async-handler";

export const tableCreation = asyncHandler(async () => {
    try {
        /// ADMIN_AUTH
        await dbConnection.query(
            `CREATE TABLE IF NOT EXISTS admin_auth (
            id INT PRIMARY KEY AUTO_INCREMENT,
            email VARCHAR(100) NOT NULL UNIQUE,
            password VARCHAR(200) NOT NULL
        
        )`
        );

        await dbConnection.query(
            `CREATE TABLE IF NOT EXISTS users (
            id INT PRIMARY KEY AUTO_INCREMENT,
            email VARCHAR(100) NOT NULL UNIQUE,
            password VARCHAR(200) NOT NULL,
            name VARCHAR(100) NOT NULL,
            phone VARCHAR(100) NOT NULL
        )`
        )

        await dbConnection.query(
            `CREATE TABLE IF NOT EXISTS events (
            id INT PRIMARY KEY AUTO_INCREMENT,
            title VARCHAR(200) NOT NULL UNIQUE,
            date VARCHAR(200) NOT NULL,
            location VARCHAR(300) NOT NULL,
            description VARCHAR(300) NOT NULL
        )`
        )

        await dbConnection.query(
            `CREATE TABLE IF NOT EXISTS registrations (
            id INT PRIMARY KEY AUTO_INCREMENT,
            user_id INT,
            event_id INT,
            name VARCHAR(200),
            email VARCHAR(200),
            phone VARCHAR(200),
            reg_date VARCHAR(100),
            FOREIGN KEY (user_id) REFERENCES users(id),
            FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
        )`
        )
    } catch (error) {
        console.error('Error initializing database:', error.message);
        process.exit(1)
    }

})