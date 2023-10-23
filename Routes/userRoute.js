const express = require("express");
const Router = express.Router();
const { registerController, loginController, fetchAllUsersController, forgotPasswordController, resetPasswordController, logoutController } = require("../controllers/userController");
const { protect, checkAccess } = require("../middlewares/authMiddleware")


Router.post("/register", registerController);
Router.post("/login",checkAccess, loginController);
Router.get("/fetchUsers", protect, fetchAllUsersController);
Router.post("/forgotPassword", forgotPasswordController);
Router.patch("/resetPassword/:token", resetPasswordController);
Router.post("/logout", protect, logoutController)

module.exports = Router;