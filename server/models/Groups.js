import { pool } from "../helpers/db.js";

//GROUP

// Function to insert a new group into the database
const insertGroup = async (group_name, owner_id) => {
  return await pool.query(
    "INSERT INTO groups (group_name, owner_id) VALUES ($1, $2) RETURNING *",
    [group_name, owner_id]
  );
};
//Function to fetch groups from database
const getGroups = async () => {
  return await pool.query("SELECT * FROM groups");
};

//Function to fetch group from database by id
const getGroupById = async (id) => {
  return await pool.query("SELECT * FROM groups WHERE id = $1", [id]);
};

//function to delete group
const deleteGroup = async (id) => {
  return await pool.query(
    "DELETE FROM groups WHERE id = $1 RETURNING *",

    [id]
  );
};
//GROUP MEMBERS

// Function to insert a new groupmember into the database
const insertGroupMember = async (user_id, group_id, role="user") => {
  return await pool.query(
    "INSERT INTO user_groups (user_id, group_id, role) VALUES ($1, $2, $3) RETURNING *",
    [user_id, group_id, role]
  );
};

//function to fetch group members from database
const getGroupMembers = async (group_id) => {
  return await pool.query(
    `SELECT users.username, users.id
      FROM users 
      JOIN user_groups ON users.id = user_groups.user_id
      WHERE user_groups.group_id = $1;`,
    [group_id]
  );
};

//function to delete groupmember
const deleteGroupMember = async (group_id , user_id) => {
  return await pool.query(
    "DELETE FROM user_groups WHERE group_id = $1 AND user_id = $2 RETURNING *",
    [group_id , user_id]
  );
};


// Add to groups
const insertToGroupMovies = async (groupId, movieId, movieTitle, poster_path, genres, releaseDate, overview) => {

  const result =  await pool.query(
      
      "INSERT INTO group_movies (id, movie_id, movie_title, poster_path, genres, release_date, overview) VALUES ($1 , $2, $3, $4, $5, $6, $7) RETURNING *",
      [groupId, movieId, movieTitle, poster_path, genres, releaseDate, overview]
  )

  return result.rowCount
}
const deleteFromGroupMovies = async (groupId, movieId) => {

  const result =  await pool.query(

      "DELETE FROM group_movies WHERE id = $1 AND movie_id = $2 RETURNING *",     
      [groupId, movieId]
  )

  return result.rowCount
}

// Get all group movies
const getAllGroupMovies = async (groupId) => {

  return await pool.query("SELECT * from group_movies WHERE id = $1" ,
      [groupId]
  )
}

// Get all groups of current user
const getAllUserGroups = async (userId) => {

  return await pool.query("SELECT user_groups.group_id, groups.group_name FROM user_groups JOIN groups groups ON user_groups.group_id = groups.id WHERE user_groups.user_id = $1;" ,
      [userId]
  )
}



export {
  getGroups,
  getGroupById,
  insertGroup,
  getGroupMembers,
  deleteGroup,
  insertGroupMember,
  deleteGroupMember,
  insertToGroupMovies,
  getAllGroupMovies,
  getAllUserGroups,
  deleteFromGroupMovies
};
