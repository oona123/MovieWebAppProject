import fs from "fs";
import path from "path";
import { pool } from "./db.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const { sign, verify } = jwt;
const { hash } = bcrypt;

const __dirname = import.meta.dirname;

// Function to initialize the test database using a SQL script
const initializeTestDb = () => {
  const sql = fs.readFileSync(path.resolve(__dirname, "../movieapp.sql"), "utf8");
  pool.query(sql);
};

// Function to insert a test user into the database
const insertTestUser = async (email, username, first_name, last_name, password) => {
  const hashedPassword = await hash(password, 10); // Ensure password is hashed before the query
  const result = await pool.query(
    "INSERT INTO users (email, username, first_name, last_name, password) VALUES ($1,$2,$3,$4,$5) RETURNING id, email, username, first_name, last_name",
    [email, username, first_name, last_name, hashedPassword]
  );
  return result.rows[0];  // Make sure it returns the user object with an 'id'
};

// Function to generate a JWT token for a test user
const getToken = (id) => {
  return sign({ user: id }, process.env.JWT_SECRET_KEY, {expiresIn: "1hr"});
};


export { initializeTestDb, insertTestUser, getToken };