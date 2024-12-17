import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useParams, useNavigate, Link } from "react-router-dom";
import "./Group.css";
import { UserContext } from "../context/userContext";

export default function Group({}) {
  const { user } = useContext(UserContext);
  const { id } = useParams();
  const [groupName, setGroupName] = useState(null);
  const [movies, setMovies] = useState([]);
  const [ownerId, setOwnerId] = useState(null);
  const [isOwner, setIsOwner] = useState(false);
  const [isMember, setIsMember] = useState(false);
  const [members, setMembers] = useState(() => {
    const savedMembers = localStorage.getItem("members");
    return savedMembers ? JSON.parse(savedMembers) : [];
  });
  const navigate = useNavigate();

  // Fetch group information by id
  useEffect(() => {
    const fetchGroupById = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/group/group/${id}`
        );
        // Fetch group_name and owner_id from database
        const groupName = response.data.rows[0].group_name;
        const ownerId = response.data.rows[0].owner_id;
        setGroupName(groupName);
        setOwnerId(ownerId);

        // Check if the current user is the owner
        if (ownerId === user.id) {
          setIsOwner(true);
        }
      } catch (error) {
        console.error("Error fetching group data:", error);
      }
    };

    // Get group's movies
    const fetchGroupMovies = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/group/getGroupMovies/` + id
        );

        setMovies(response.data);
      } catch (error) {
        console.error("Error fetching group movies:", error);
      }
    };

    // Fetch group members
    const fetchGroupMembers = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/group/groupmember/${id}`
        );
        const groupMembers = response.data; // Members list
        setMembers(groupMembers);

        // Check if the current user is a member
        const isMember = groupMembers.some((member) => member.username === user.username);
        setIsMember(isMember);
      } catch (error) {
        console.error(error);
      }
    };

    fetchGroupById(); // Fetch group details

    // Fetch data if user is authenticated
    if (user.token) {
      fetchGroupMembers();
      fetchGroupMovies();
    } else {
      setMovies([]);
      setMembers([]);
    }
  }, [id]);

  // Delete group and navigate back to the groups list
  const deleteGroupPage = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this group and all its data?"
    );
    if (!confirmDelete) {
      return;
    }
    try {
      const response = await axios.delete(
        `${process.env.REACT_APP_API_URL}/group/group/${id}`
      );
      alert("Group deleted successfully");
      navigate("/groups"); // Navigate back to groups page
    } catch (error) {
      console.error("Error deleting group:", error);
      alert("Failed to delete group.");
    }
  };

  // Save members to localStorage whenever members state changes
  useEffect(() => {
    localStorage.setItem("members", JSON.stringify(members));
  }, [members]);

  // Join the group
  const joinGroup = async () => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/group/group/${id}`,
        {
          user_id: user.id,
          group_id: id,
        }
      );
      setMembers((prevMembers) => [...prevMembers, user]); // Add user to member list
      alert("You joined group", groupName);
      setIsMember(true); // Update member status
    } catch (error) {
      console.error("Error creating group:", error);
    }
  };

  // Delete a member
  const deleteGroupMember = async (userId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this groupmember?"
    );
    console.log("ID", userId)
    if (!confirmDelete) {
      return;
    }
    try {
      const response = await axios.delete(
        `${process.env.REACT_APP_API_URL}/group/groupmember/${id}`,
        {
          data: {
            user_id: userId,
          },
        }
      );
      alert("Groupmember deleted successfully");
      //delete user from members array
      setMembers((prevMembers) =>
        prevMembers.filter((member) => member.username !== user.username)
      );
    } catch (error) {
      console.error("Error deleting groupmember:", error);
      alert("Failed to delete groupmember.");
    }
  };

  // Leave a group
  const leaveGroup = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want leave this groupmember?"
    );
    if (!confirmDelete) {
      return;
    }
    try {
      const response = await axios.delete(
        `${process.env.REACT_APP_API_URL}/group/groupmember/${id}`,
        {
          data: {
            user_id: user.id,
          },
        }
      );
      setIsMember(false); // Update member status
    } catch (error) {
      console.error("Error deleting groupmember:", error);
      alert("Failed to delete groupmember.");
    }
  };

  // Remove a movie from the group 
  const handleRemoveFromGroupMoviesClick = async (movie_id) => {
    try {
      await axios.delete(process.env.REACT_APP_API_URL + "/groups/removeFromUserMovies", {
        data: {
          groupId: id,
          movieId: movie_id,
        },
      });

      setMovies((prevMovies) =>
        prevMovies.filter((movie) => movie.movie_id !== movie_id)
      );
    } catch (error) {
      console.error("Failed to remove movie from group list: ", error.status);
    }
  };

  return (
    <div className="group-container">
      <header className="header">
        <div className="group-name">
          <h1>{groupName}</h1>
        </div>
        <div className="actions">
          <p>
            {isOwner
              ? "You are the owner of the group"
              : isMember
              ? "You are a member of the group"
              : "You are not a member of the group"}
          </p>
          {isMember ? (
            <button onClick={leaveGroup}>Leave Group</button>
          ) : (
            <button onClick={joinGroup}>Join Group</button>
          )}

          {isOwner ? <button onClick={deleteGroupPage}>Delete group</button> : ""}
        </div>
      </header>
      {isMember ? (
        <section className="members">
          <h2>Group members</h2>
          <div className="members-list">
            <ul>
              {members.map((member) => (
                <li key={member.user_id}>
                  {member.username}
                  {member.role}
                  {isOwner && (
                    
                    <button className="delete-member-btn" onClick={() => deleteGroupMember(member.id)}>

                      Delete user from group
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : (
        ""
      )}

      {isMember ? (
        <section className="group-movies">
          <h2>Movies</h2>
          <div className="group-movies-grid">
            {movies.map((movie) => (
              <li key={movie.movie_id} className="group-movie-card">
                {movie.poster_path ? (
                  <Link to={`/movie/${movie.movie_id}`}>
                    <img
                      src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                      alt={movie.title}
                    />
                  </Link>
                ) : (
                  <p>No Image Available</p>
                )}
                <Link to={`/movie/${movie.movie_id}`}>{movie.movie_title}</Link>
                <button className="delete-group-movie-btn" onClick={() => handleRemoveFromGroupMoviesClick(movie.movie_id)}>
                  Remove
                </button>
              </li>
            ))}
          </div>
        </section>
      ) : (
        <p>You need to join the group to see the group page</p>
      )}
    </div>
  );
}
