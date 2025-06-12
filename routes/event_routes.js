import express from "express";
import { tokenValidation } from "../middleware/token_validation.js";
import { createEvent, deleteEvent, editEvent, getAllEvents, getSingleEvent } from "../controllers/event_controller.js";

const router = express.Router()

router.use(tokenValidation)

router.route("/event").post(createEvent).get(getAllEvents)
router.route("/event/:id").get(getSingleEvent).put(editEvent).delete(deleteEvent)

export default router