import express from "express";
import { validateFields } from "../middleware/validateFields";
import { requireUserExists, rejectIfUserExists } from "../middleware/validateUser";
import { checkLogin } from "../middleware/checkLogin";
import { loginUser, registerUser, getMe, logoutUser } from "../controller/users.controller";
import {catchedController} from "../utils/errors";

const usersRouter = express.Router();

usersRouter.post("/register", validateFields(["email", "password", "name", "phone"]), rejectIfUserExists, catchedController(registerUser));

usersRouter.post("/login", validateFields(["email", "password"]), requireUserExists, catchedController(loginUser));

usersRouter.get("/me", checkLogin, catchedController(getMe))

usersRouter.post("/logout", checkLogin, catchedController(logoutUser))



export default usersRouter;
