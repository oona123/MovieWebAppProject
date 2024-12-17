import { response } from "express";
import {
  getGroups,
  insertGroup,
  deleteGroup,
  getGroupById,
  insertGroupMember,
  deleteGroupMember,
  getGroupMembers,
  getAllUserGroups,
  insertToGroupMovies,
  getAllGroupMovies,
  deleteFromGroupMovies
} from "../models/Groups.js";

//GROUP

//get groups
const getGroupsObject = async (req, res) => {
  try {
    const result = await getGroups();
    return res.json(result.rows);
  } catch (error) {
    console.error("Error fetching groups:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

//get group by id
const getGroupByIdObject = async (req, res) => {
  try {
    const { id } = req.params;
    const group = await getGroupById(id);
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }
    return res.json(group);
  } catch (error) {
    console.error("Error fetching group:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Controller to handle group creating
const postGroup = async (req, res, next) => {
  try {
    const group_name = req.body.group_name;
    const id_owner = req.body.owner_id;
    if (!group_name || group_name.trim() === "") {
      return next(new ApiError("Invalid group name", 400));
    }
    // Insert group into database
    const groupFromDb = await insertGroup(group_name, id_owner);

    // Insert user into created group
    insertGroupMember(id_owner, groupFromDb.rows[0].id, "owner")

    if (!groupFromDb || !groupFromDb.rows[0]) {
      throw new Error("Failed to insert group into the database");
    }
    const group = groupFromDb.rows[0];
    return res
      .status(201)
      .json(createGroupObject(group.id, group.group_name, group.id_owner));
  } catch (error) {
    console.error("Error in postGroup controller:", error);
    return next(error);
  }
};

// Function to create group object
const createGroupObject = (id, group_name, owner_id) => {
  return {
    id: id,
    group_name: group_name,
    owner_id: owner_id,
  };
};

// Controller to handle group delete
const deleteGroupObject = async (req, res, next) => {
  try {
    const id = req.params.id;
    const result = await deleteGroup(id);
    if (result.rowCount === 0) {
      return next(new ApiError("Group not found or already deleted", 404));
    }
    return res.status(200).json({ message: "Group deleted successfully" });
  } catch (error) {
    return next(error);
  }
};
//GROUPMEMBERS

//get groupMembers
const getGroupMembersObject = async (req, res) => {
  try {
    const result = await getGroupMembers(req.params.id);
    return res.json(result.rows);
  } catch (error) {
    console.error("Error fetching groupsMembers:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Controller to handle group joining
const joinGroup = async (req, res, next) => {
  try {
    const user_id = req.body.user_id;
    const group_id = req.body.group_id;
    // Insert groupmember into database
    insertGroupMember(user_id, group_id);
    return res.status(201).json(joinGroupObject(user_id, group_id));
  } catch (error) {
    console.error("Error in postGroup controller:", error);
    return next(error);
  }
};

// Function to join group object
const joinGroupObject = (user_id, group_id) => {
  return {
    user_id: user_id,
    group_id: group_id,
  };
};

// Controller to handle groupmember delete
const deleteGroupMemberObject = async (req, res, next) => {
  try {
    const group_id = req.params.id
    const user_id = req.body.user_id;
    const result = await deleteGroupMember(group_id, user_id);
    return res
      .status(200)
      .json({ message: "Groupmember deleted successfully" });
  } catch (error) {
    return next(error);
  }
};

// Get movies added to the group list
const postGetGroupMovies = async (req, res, next) => {

  try {
      const  groupId  = req.params.id
      const result = await getAllGroupMovies(groupId)


      if (result.rowCount > 0) {
          return res.status(200).json(result.rows);
      } else {
          res.status(404).json({ error: "Could not find group movies" });
      }
  } catch (error) {

      console.log(error.message)
      res.status(500).json({ error: "Failed to remove movie from group movies." })
  }

}

// Add a movie to the group list
const postAddToGroupMovies = async (req, res, next) => {

  try {
      const { id, movieId, movieTitle, poster_path, genres, overview, releaseDate } = req.body
      const affectecRows = await insertToGroupMovies(id, movieId, movieTitle, poster_path, genres, releaseDate, overview)

      if (affectecRows > 0){
      res.status(200).json({ message: "Movie added to favorites successfully!" })
      } else{
          res.status(400).json({error: "Movie could not be added to favorites."})
      }
  } catch (error) {
      console.log(error.message)
      res.status(500).json({ error: "Failed to add movie to favorites." })
  }

}

// Remove a movie from the group list
const postDeleteGroupMovie = async (req, res, next) => {

  try {
    const { groupId, movieId} = req.body
    const response = await deleteFromGroupMovies(groupId, movieId)
    return res.status(200).json({message: "Movie removed from group list successfully"})
  } catch (error) {
    res.status(500).json({error: "Failed to remove movie from list"})
  }
}

// Get all groups user is a member of
const postGetUserGroups = async (req, res, next) => {
  try {
    const userId = req.params.id
    const response = await getAllUserGroups(userId)
    res.status(200).json(response.rows)
} catch (error) {
    console.log(error.message)
    res.status(500).json({ error: "Failed to add movie to favorites." })
}
}


export {
  postGroup,
  getGroupsObject,
  getGroupByIdObject,
  getGroupMembersObject,
  deleteGroupObject,
  joinGroup,
  deleteGroupMemberObject,
  postGetGroupMovies,
  postAddToGroupMovies,
  postGetUserGroups,
  postDeleteGroupMovie
};
