import { Router } from "express";
import {
  getGroupsObject,
  postGroup,
  getGroupMembersObject,
  deleteGroupObject,
  getGroupByIdObject,
  joinGroup,
  deleteGroupMemberObject,
  postGetGroupMovies,
  postAddToGroupMovies,
  postGetUserGroups,
  postDeleteGroupMovie
} from "../controllers/GroupsController.js";

const router = Router();

router.post("/groups", postGroup);
router.post("/group/:id", joinGroup);
router.get("/groups", getGroupsObject);
router.get("/group/:id", getGroupByIdObject);
router.get("/groupmember/:id", getGroupMembersObject);
router.delete("/group/:id", deleteGroupObject);
router.delete("/groupmember/:id", deleteGroupMemberObject);


//Routes for group movies

router.get("/getUserGroups/:id", postGetUserGroups)
router.get("/getGroupMovies/:id", postGetGroupMovies)
router.post("/addToGroupMovies", postAddToGroupMovies)
router.delete("/removeFromUserMovies", postDeleteGroupMovie)

export default router;
