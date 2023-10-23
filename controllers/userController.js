const User = require("../models/Users"); 
const ClassGroup = require('../models/classGroup');  
const expressAsyncHandler = require("express-async-handler");
const generateToken = require("../Config/generateToken");
const sendEmail = require("./../utils/email")
const crypto = require("crypto");

// logging in
const loginController = expressAsyncHandler(async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });

  if (user && (await user.matchPassword(password))) {
    if (user.accessGranted) {
      req.user = {
        _id: user.id,
        name: user.name,
        username: user.username,
        email: user.email,
        isAdmin: user.isAdmin,
        accessGranted: user.accessGranted,
      };

      res.json({
        _id: user.id,
        name: user.name,
        username: user.username,
        email: user.email,
        isAdmin: user.isAdmin,
        accessGranted: user.accessGranted,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ msg: "Wait for admin's approval" });
    }
  } else {
    res.status(400).json({ msg: "Invalid Username or Password" });
  }
});

// registration
const registerController = expressAsyncHandler(async (req, res) => {
  try {
    const { name, email, password, username, selectedClass } = req.body;

    // check for all fields
    if (!name || !email || !password || !username || !selectedClass ) {
      return res.status(400).json({ msg: "All fields are required" });
    }

    // if account exists
    const userExist = await User.findOne({ email });
    if (userExist) {
      return res.status(400).json({ msg: "Account already exists" });
    }

    // if Username is taken
    const userNameExist = await User.findOne({ username });
    if (userNameExist) {
      return res.status(400).json({ msg: "Username already Taken" });
    }
    // Create a new user
    const user = new User({
      name,
      username,
      email,
      password,
      selectedClass
    });

    // Save the user
    await user.save();

    // Check if the class group exists for the selected class
    let classGroup = await ClassGroup.findOne({ className: selectedClass });

    if (!classGroup) {
      // If class group doesn't exist, create a new one
      classGroup = new ClassGroup({
        className: selectedClass,
        students: [user._id]  // Add the student to the class group
      });
    } else {
      // If class group exists, add the student to it
      classGroup.students.push(user._id);
    }

    // Save the updated class group
    await classGroup.save();

    res.json({
      _id: user.id,
      name: user.name,
      username: user.username,
      email: user.email,
      isAdmin: user.isAdmin,
      selectedClass: user.selectedClass,
      token: generateToken(user._id)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// fetching all users
const fetchAllUsersController = expressAsyncHandler(async (req, res) => {
  const keyword = req.query.search
    ? {
        $or: [
          { username: { $regex: req.query.search, $options: "i" } },
          { name: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};

  const users = await User.find({
    ...keyword,
    _id: { $ne: req.user._id },
  });
  res.send(users);
});

const forgotPasswordController = expressAsyncHandler(async (req, res) => {
  const { email } = req.body; // Extract email from request body

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(400).json({ msg: "User with the given email could not be found" });
  }

  const resetToken = user.createResetPasswordToken();
  console.log(resetToken);

  await user.save({validateBeforeSave: false});

  const resetUrl = `${req.protocol}://${req.get("host")}/user/resetPassword/${resetToken}`;
  const message = `We have received a password reset request. Please use the below link to reset your password\n\n${resetUrl}. The link will be valid for only 10 minutes`


  try {
    await sendEmail({
      email: user.email,
      subject: "Password reset request received",
      message: message
    });

    res.status(200).json({
      status: "success",
      msg: "password reset link sent to user email"
    })
  } catch (error) {
    console.log(error);
    user.passwordResetToken= undefined;
    user.passwordResetTokenExpires= undefined;
    await user.save({validateBeforeSave: false});

    return res.status(500).json({msg: "There was an error sending password reset email. Please try again later"})
  }

});

const resetPasswordController = expressAsyncHandler(async (req, res) => {
  const token = crypto.createHash("sha256").update(req.params.token).digest("hex");
  console.log('Token from URL:', req.params.token); // Log the token from the URL
  console.log('Hashed Token:', token); // Log the hashed token

  const user = await User.findOne({
    passwordResetToken: token,
    passwordResetTokenExpires: { $gt: Date.now() },
  });

  console.log('User:', user); // Log the user found based on the token

  if (!user) {
    return res.status(400).json({ msg: "Token is invalid or has expired" });
  }

  // Resetting user password
  user.password = req.body.password;
  user.passwordResetToken = undefined;
  user.passwordResetTokenExpires = undefined;
  user.passwordChangedAt = Date.now();

  await user.save(); 

  // proceed to log in the user if access was granted
  if (user.accessGranted) {
    req.user = {
      _id: user.id,
      name: user.name,
      username: user.username,
      email: user.email,
      isAdmin: user.isAdmin,
      accessGranted: user.accessGranted,
    };

    res.json({
      _id: user.id,
      name: user.name,
      username: user.username,
      email: user.email,
      isAdmin: user.isAdmin,
      accessGranted: user.accessGranted,
      token: generateToken(user._id),
    });
  } else {
    res.status(401).json({ msg: "Wait for admin's approval" });
  }
});

const logoutController = (req, res) => {
  // Clear the authentication token (e.g., JWT token in a cookie)
  res.clearCookie('token');


  req.user = null;

  res.json({ msg: "Logged out successfully" });
};



module.exports = { registerController, loginController, fetchAllUsersController, forgotPasswordController, logoutController, resetPasswordController };
