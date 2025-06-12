import mysql2 from "mysql2/promise";

export const  dbConnection = mysql2.createPool({
    host:process.env.HOST,
    user:process.env.USER, 
    password:process.env.PASSWORD, 
    database:process.env.DB
})