import { constant } from "../constant.js";

export const errorHandler = (err, req, res, next) => {
    const statusCode = res.statusCode;

    switch (statusCode) {
        case constant.NOT_FOUND:
            res.json({ status: statusCode, message: "NOT FOUND !!", error: err.message })
            break;
        case constant.SERVER_ERROR:
            res.json({ status: statusCode, message: "SERVER ERROR !!", error: err.message })
            break;
        case constant.UNAUTHORIZED:
            res.json({ status: statusCode, message: "UNAUTHORIZED ERROR !!", error: err.message })
                break;
        case constant.VALIDATION_ERROR:
            res.json({ status: statusCode, message: "VALIDATION ERROR !!", error: err.message })
                        break;
        default:
            break;
    }
}