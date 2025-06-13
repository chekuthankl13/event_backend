import express, { urlencoded } from "express";
import { errorHandler } from "./middleware/error_handler.js"
import { router } from "./routes/auth_routes.js"
import { dbConnection } from "./config/db_config.js";
import eventRoutes from "./routes/event_routes.js"
import regRoutes from "./routes/reg_routes.js"
import { tableCreation } from "./config/mysql_table.js";
import cors from 'cors'


const app = express();
const port = process.env.PORT || 2020;

//MIDDLEWARE FOR BODY 
app.use(express.json());
app.use(express.urlencoded({ extended:false  }));
app.use(cors())
//routes 
app.use("/api/", router)
app.use("/api/", eventRoutes)
app.use("/api/", regRoutes)



///error handler 
app.use(errorHandler)


dbConnection.query("SELECT 1").then((data) => {
    console.log(`DATABASE connection established...`);
    tableCreation()
    app.listen(port, '0.0.0.0', () => {
        console.log(`server connection established on port --> ${port}`);

    })
}).catch((err) => {
    console.log(`DATABASE connection failed --> ${err.message}`);
    process.exit(1);

})

