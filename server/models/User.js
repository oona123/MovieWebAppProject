import { pool } from "../helpers/db.js";

// Function to insert a new user into the database
const insertUser = async (email, username, first_name, last_name, hashedPassword) => {
  return await pool.query(
    "INSERT INTO users (email, username, first_name, last_name, password) VALUES ($1,$2,$3,$4,$5) RETURNING *",
    [email, username, first_name, last_name, hashedPassword]
  );
};

const selectUserByEmailOrUsername = async (identifier) => {
  return await pool.query("SELECT * FROM users WHERE email = $1 OR username = $1", [
    identifier,
  ]);
};

const selectUserInfo = async (id) => {
  try {
    const result = await pool.query(
      "SELECT username, email, first_name, last_name FROM users WHERE id = $1",
      [id]
    );

    return result.rows;
  } catch (error) {
    console.error("Error fetching the user info", error);
    throw error;
  }
};

const deleteUser = async (id) => {
  return await pool.query("DELETE FROM users WHERE id = $1 RETURNING *", [id]);
};

export { insertUser, selectUserByEmailOrUsername, selectUserInfo, deleteUser };
