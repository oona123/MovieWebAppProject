# Movie Application Project

This README provides an overview of the Movie Application project, developed as part of the *Web Programming Application Project* course at Oulu University of Applied Sciences, Autumn 2024. The application is aimed at movie enthusiasts, offering features to explore, review, and manage movie-related content.

---

## Table of Contents
1. [Project Overview](#project-overview)
2. [Features](#features)
3. [Setup Instructions](#setup-instructions)
4. [Usage Guide](#usage-guide)
5. [Testing](#testing)
6. [Contact Information](#contact-information)

---

## Project Overview

The Movie Application is a web-based platform developed using:
- **Frontend:** React
- **Backend:** Node.js
- **Database:** PostgreSQL

### APIs Used:
1. **The Movie Database (TMDb):** Provides comprehensive movie-related data. Registration is required to obtain an API key.
2. **Finnkino API:** Offers publicly available XML data on movie showtimes across theaters.

The application enables movie enthusiasts to explore movies, share their favorites, and interact in groups, providing a community-driven experience.

---

## Features

| **ID** | **Feature**                  | **Description**                                                                 |
|--------|-------------------------------|---------------------------------------------------------------------------------|
| 1      | **Responsiveness**           | User interface adjusts dynamically to window size for an optimal experience.   |
| 2      | **Registration**             | Users can register with an email and password. Passwords require at least 8 characters, including one uppercase letter and one number. |
| 3      | **Login**                    | Registered users can log in and log out of the platform.                       |
| 4      | **Account Deletion**         | Users can delete their accounts, along with all their data (reviews, groups, etc.). |
| 5      | **Movie Search**             | Search for movies using at least three different criteria. Available without login. |
| 6      | **Showtimes**                | Browse Finnkino theater showtimes. Available without login.                    |
| 7      | **Group Page**               | Create groups with custom names, visible in a public list. Only members can access detailed content. Group creators can delete their groups. |
| 8      | **Add Group Members**        | Users can send join requests to groups. Group owners can approve or reject requests. |
| 9      | **Remove Group Members**     | Group owners can remove members, and members can leave groups voluntarily.    |
| 10     | **Group Page Customization** | Group members can add movies (from searches) and showtimes to their group page. |
| 11     | **Movie Reviews**            | Logged-in users can write reviews with a star rating (1-5), text, email address, and timestamp. |
| 12     | **Review Browsing**          | All users can browse reviews and access detailed movie information.            |
| 13     | **Favorite List**            | Logged-in users can create a personal favorite movie list, visible on their profile. |
| 14     | **Share Favorite List**      | Users can share their favorite list as a URI link, accessible to all users.    |
| 15     | **Custom Feature**           | One additional user-defined feature.                                           |

---

## Setup Instructions

To run the application locally, follow these steps:

1. **Clone the Repository**:
   ```bash
   git clone <repository-url>
   cd <repository-directory>
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   cd server && npm install
   ```

3. **Set Up Environment Variables**:
   - Create a `.env` file in the root directory with the following variables:
     ```
     TMDB_API_KEY=your_tmdb_api_key
     DATABASE_URL=your_postgresql_connection_string
     ```

4. **Run the Application**:
   - Start the backend:
     ```bash
     cd server
     npm run devStart
     ```
   - Start the React frontend:
     ```bash
     npm start
     ```

5. **Access the Application**:
   - Visit `http://localhost:3000` in your browser.

---

## Usage Guide

### Key Interactions:
- **Search for Movies:** Use the search bar on the homepage to find movies based on various criteria.
- **Register and Log In:** Create an account to unlock features like reviews, favorites, and group interactions.
- **Create Groups:** Navigate to the "Groups" section to create or join a group and share movie-related content.
- **Write Reviews:** Use the movie detail page to leave a review with a star rating.
- **Manage Favorites:** Add movies to your favorite list and share it with others via a URI link.

---

## Testing

Automated unit tests are implemented for the following features:
1. Login
2. Logout
3. Registration
4. Account Deletion
5. Review Browsing

---


## Contact Information

**Course:** Web Programming Application Project, Autumn 2024  
**Institution:** Oulu University of Applied Sciences

---

Thank you for contributing to the Movie Application project!

