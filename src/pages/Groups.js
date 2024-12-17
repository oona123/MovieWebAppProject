import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./Groups.css";
import { UserContext } from "../context/userContext";

export default function Groups() {
  const { user } = useContext(UserContext);
  const [groupName, setGroupName] = useState("");
  const [message, setMessage] = useState("");
  const [groupData, setGroupData] = useState([]);
  const [error, setError] = useState(null);

  // Handle create group button click event
  const handleCreateGroup = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/groups/groups`,
        {
          group_name: groupName,
          owner_id: user.id,
        }
      );
      setMessage(`Group "${response.data.group_name}" created`);
      setGroupData([...groupData, response.data]);
      // When group is created, set input to null
      setGroupName("");
    } catch (error) {
      console.error("Error creating group:", error);
      setMessage("Failed to create group. Please try again.");
    }
  };

  // Fetch groups
  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/groups/groups`
        );
        setGroupData(response.data);
      } catch (error) {
        setError("Failed to fetch group data ");
        console.error(error);
      }
    };

    fetchGroups();
  }, []);

  return (
    <div className="groups-container">
      <div className="create-group">
        <h2>Create a New Group</h2>
        <form onSubmit={handleCreateGroup}>
          <label htmlFor="groupName">Group Name:</label>
          <input
            type="text"
            id="groupName"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            required
          />
          <button type="submit">Create Group</button>
        </form>
        {message && <p>{message}</p>}
      </div>

      <section className="groups">
        <h2>Groups</h2>
        <div className="group-list">
          <ul>
            {groupData.map((group) => (
              <li key={group.id}>
                <Link
                  to={{
                    pathname: `/group/${group.id}`,
                    state: { groupData: group },
                  }}
                >
                  {group.group_name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
