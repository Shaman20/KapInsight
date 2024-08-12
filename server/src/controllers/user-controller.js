const validateEmail = require("../helpers/email-validator");
const { validateRequiredFields } = require("../helpers/user-validator");
const userService = require("../services/user-service");

const signUp = async (req, res) => {
  const { firstName, lastName, emailAddress, phoneNumber, age, password } =
    req.body;

  const requiredFields = [
    "firstName",
    "lastName",
    "emailAddress",
    "phoneNumber",
    "password",
  ];

  const missingFields = validateRequiredFields(req.body, requiredFields);

  if (missingFields.length > 0) {
    res.status(400).json({ errors: missingFields });
    return;
  } else if (!validateEmail(emailAddress)) {
    res.status(404).json({ error: "Invalid Email Address" });
    return;
  }

  try {
    const user = await userService.signUp(
      firstName,
      lastName,
      emailAddress,
      phoneNumber,
      age,
      password
    );
    console.log("Sign in user controller", user);
    res.status(200).json({ msg: "Account Created", result: user });
  } catch (error) {
    console.log("Sign in user controller error", error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

const logIn = async (req, res) => {
  const { emailAddress, password } = req.body;

  const requiredFields = ["emailAddress", "password"];

  const missingFields = validateRequiredFields(req.body, requiredFields);
  if (missingFields.length > 0) {
    res.status(400).json({ errors: missingFields });
    return;
  } else {
    try {
      const user = await userService.loginUser(emailAddress, password);
      return res.status(201).json({
        msg: "Logged In",
        result: user,
      });
    } catch (error) {
      res.send(500).json({
        msg: "Internal Server Error",
      });
    }
  }
};

const logout = async (req, res) => {
  try {
    const authHeader = req.headers["authorization"];

    if (!authHeader) {
      return res
        .status(401)
        .json({ success: false, message: "Authorization header missing" });
    }

    // Call the logout function from userService to handle the logout process
    const userId = req.user.emailAddress;
    // Call a function from userService to handle the logout process
    await userService.logoutUser(userId);
    res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = { signUp, logIn, logout };
