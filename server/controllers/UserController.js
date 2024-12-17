import { hash, compare } from "bcrypt";
import {
  insertUser,
  selectUserByEmailOrUsername,
  selectUserInfo,
  deleteUser,
} from "../models/User.js";
import { ApiError } from "../helpers/ApiError.js";
import jwt from "jsonwebtoken";

const { sign } = jwt;

// Controller to handle user registration
const postRegistration = async (req, res, next) => {
  try {
    const { email, username, password } = req.body;

    // Email validation regex
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!email || email.length === 0 || !emailRegex.test(email)) {
      return next(new ApiError("Invalid email for user", 400));
    }

    if (!username || username.length === 0)
      return next(new ApiError("Invalid username for user", 400));
    if (!password || password.length < 8)
      return next(new ApiError("Invalid password for user", 400));

    // Check if password has at least one uppercase letter and one number
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)/;
    if (!passwordRegex.test(password))
      return next(new ApiError("Password must have at least one uppercase letter and one number", 400));

    // First and last name are optional
    const first_name = req.body.first_name || null;
    const last_name = req.body.last_name || null;
    // Hash the password before storing it
    const hashedPassword = await hash(password, 10);
    // Insert user into database
    const userFromDb = await insertUser(
      email,
      username,
      first_name,
      last_name,
      hashedPassword
    );
    const user = userFromDb.rows[0];

    return res
      .status(201)
      .json(
        createUserObject(
          user.id,
          user.email,
          user.username,
          user.first_name,
          user.last_name
        )
      );
  } catch (error) {
    return next(error);
  }
};

// Function to create a user object
const createUserObject = (
  id,
  email,
  username,
  first_name,
  last_name,
  token = undefined
) => {
  // Initializing the user object with mandatory properties
  const userObject = {
    id: id,
    email: email,
    username: username,
  };
  // Optional properties
  if (first_name) userObject.first_name = first_name;
  if (last_name) userObject.last_name = last_name;
  // If the token is not undefined, add it to user object
  if (token !== undefined) userObject.token = token;

  return userObject;
};

// Controller to handle user login
const postLogin = async (req, res, next) => {
  const invalid_credentials_message = "Invalid credentials.";
  try {
    const { identifier, password } = req.body;
    // Ensure both fields are provided
    if (!identifier || !password)
      return next(new ApiError("Both identifier and password are required.", 400));
    // Query the database to find the user by email or username
    const userFromDb = await selectUserByEmailOrUsername(identifier);
    if (userFromDb.rowCount === 0)
      return next(new ApiError(invalid_credentials_message, 401));

    const user = userFromDb.rows[0];
    // Check if the password matches
    const isPasswordValid = await compare(password, user.password);
    if (!isPasswordValid) return next(new ApiError(invalid_credentials_message, 401));
    // Generate a JWT token
    const token = sign({ id: user.id }, process.env.JWT_SECRET_KEY, { expiresIn: "1hr" });
    // Respond with the user object and token
    return res
      .status(200)
      .json(
        createUserObject(
          user.id,
          user.email,
          user.username,
          user.first_name,
          user.last_name,
          token
        )
      );
  } catch (error) {
    return next(error);
  }
};

// Controller to handle getting user info
const getUserInfo = async (req, res, next) => {
  try {
    // Make sure user is authenticated before fetching their info
    if (!req.user || !req.user.id) {
      return next(new ApiError("Unauthorized access", 401));
    }

    // Query the database to get user info by ID
    const result = await selectUserInfo(req.user.id);

    if (!result || result.length === 0) {
      return next(new ApiError("User not found", 404));
    }

    // Respond with the user info (don't return sensitive data like password)
    const user = result[0];
    return res.status(200).json({
      username: user.username,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
    });
  } catch (error) {
    return next(error);
  }
};

// Controller to handle account delete
const deleteAccount = async (req, res, next) => {
  try {
    if (!req.body.id) {
      return next(new ApiError("Unauthorized access", 401));
    }

    const id = parseInt(req.body.id);
    await deleteUser(id);

    return res.status(200).json({ id: id });
  } catch (error) {
    return next(error);
  }
};

export { postRegistration, postLogin, getUserInfo, deleteAccount };
