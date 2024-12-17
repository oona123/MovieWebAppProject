import { initializeTestDb, insertTestUser, getToken } from "./helpers/test.js";

const base_url = "http://localhost:3001"; // Base URL for API endpoints

import { expect } from "chai";

describe("POST register", () => {
  // Initialize the test database before the tests
  before(() => {
    initializeTestDb();
  });

  const email = `register@foo.com`;
  const first_name = "FirstName";
  const last_name = "LastName";
  const valid_password = "Register123";

  // Tests for registration
  it("should not post a user with less than 8 character password", async () => {
    const short_password = "short1";
    const username = "username1";
    const response = await fetch(base_url + "/user/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        username: username,
        first_name: first_name,
        last_name: last_name,
        password: short_password,
      }),
    });
    const data = await response.json();
    expect(response.status).to.equal(400, data.error);
    expect(data).to.be.an("object");
    expect(data).to.include.all.keys("error");
  });

  it("should not post a user with password that doesn't have an uppercase letter", async () => {
    const invalid_password = "register123";
    const username = "username2";
    const response = await fetch(base_url + "/user/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        username: username,
        first_name: first_name,
        last_name: last_name,
        password: invalid_password,
      }),
    });
    const data = await response.json();
    expect(response.status).to.equal(400, data.error);
    expect(data).to.be.an("object");
    expect(data.error).to.equal("Password must have at least one uppercase letter and one number")
  });

  it("should not post a user with password that doesn't have a number", async () => {
    const invalid_password = "Register";
    const username = "username2";
    const response = await fetch(base_url + "/user/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        username: username,
        first_name: first_name,
        last_name: last_name,
        password: invalid_password,
      }),
    });
    const data = await response.json();
    expect(response.status).to.equal(400, data.error);
    expect(data).to.be.an("object");
    expect(data.error).to.equal("Password must have at least one uppercase letter and one number")
  });

  it("should register with valid email, username and password (first_name and last_name optional)", async () => {
    const username = "username2";
    const response = await fetch(base_url + "/user/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        username: username,
        first_name: first_name,
        last_name: last_name,
        password: valid_password,
      }),
    });
    const data = await response.json();
    expect(response.status).to.equal(201, data.error);
    expect(data).to.be.an("object");
    expect(data).to.include.all.keys("id", "email", "username");
  });

  it("should register without first_name and last_name", async () => {
    const username = "username3";
    const email = `register3@foo.com`;
    const response = await fetch(base_url + "/user/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        username: username,
        password: valid_password,
      }),
    });
    const data = await response.json();
    expect(response.status).to.equal(201, data.error);
    expect(data).to.be.an("object");
    expect(data).to.include.all.keys("id", "email", "username");
    expect(data).to.not.have.property("first_name");
    expect(data).to.not.have.property("last_name");
  });
});

// Tests for login
describe("POST login", () => {
  const email = "login@foo.com";
  const username = "loginuser";
  const password = "Login123";

  before(async () => {
    await insertTestUser(email, username, "FirstName", "LastName", password);
  });

  it("should login with valid email and password", async () => {
    const response = await fetch(base_url + "/user/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ identifier: email, password: password }),
    });
    const data = await response.json();
    expect(response.status).to.equal(200, data.error);
    expect(data).to.be.an("object");
    expect(data).to.include.all.keys("id", "email", "username", "token");
  });

  it("should login with valid username and password", async () => {
    const response = await fetch(base_url + "/user/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ identifier: username, password: password }),
    });
    const data = await response.json();
    expect(response.status).to.equal(200, data.error);
    expect(data).to.be.an("object");
    expect(data).to.include.all.keys("id", "email", "username", "token");
  });

  it("should not login with invalid email/username", async () => {
    const response = await fetch(base_url + "/user/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ identifier: "wrongemail@foo.com", password: password }),
    });
    const data = await response.json();
    expect(response.status).to.equal(401);
    expect(data).to.be.an("object");
    expect(data).to.include.all.keys("error");
    expect(data.error).to.equal("Invalid credentials.");
  });

  it("should not login with invalid password", async () => {
    const response = await fetch(base_url + "/user/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ identifier: email, password: "wrongpassword" }),
    });
    const data = await response.json();
    expect(response.status).to.equal(401);
    expect(data).to.be.an("object");
    expect(data).to.include.all.keys("error");
    expect(data.error).to.equal("Invalid credentials.");
  });
});

// Tests for delete account
  describe("DELETE /user/delete", () => {
  const email = "delete@foo.com";
  const username = "deleteuser";
  const password = "Delete123";
  let token;
  let userId;

  before(async () => {
    const user = await insertTestUser(email, username, "FirstName", "LastName", password);
    userId = user.id;
    token = getToken(userId);
  });

  it("should delete account with valid token and user ID", async () => {
    const response = await fetch(base_url + "/user/delete", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({ id: userId }),
    });
    const data = await response.json();

    expect(response.status).to.equal(200, data.error);
    expect(data).to.be.an("object");
    expect(data).to.include.all.keys("id");
    expect(data.id).to.equal(userId);
  });

}); 

// Tests for reviews
// Test for posting a review
describe("POST /reviews/add", () => {
  const testMovieId = 99;
  const testMovieTitle = "Fake Movie Title";

  it("should successfully add a review for a movie", async () => {
    const userId = 1;
    const grade = 3;
    const review = "Good movie!";

    const response = await fetch(base_url + "/reviews/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: userId,
        movieId: testMovieId,
        movieTitle: testMovieTitle,
        grade: grade,
        review: review,
      }),
    });

    const data = await response.json();
    expect(response.status).to.equal(201);
    expect(data.message).to.equal("Review added successfully!");
  });
});

// Test for getting reviews
describe("GET /reviews/:movieId", () => {
  const testMovieId = 99;

  it("should successfully get reviews for a movie", async () => {
    const response = await fetch(base_url + `/reviews/${testMovieId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    expect(response.status).to.equal(200);
    expect(data).to.be.an("array");
    expect(data[0]).to.have.property("review");
    expect(data[0]).to.have.property("grade");
  });
});

// Tests for deleting a review
describe("DELETE /reviews/removeFromReviews", () => {
  const testMovieId = 99;
  const userId = 1;

  it("should successfully delete a review for a movie", async () => {
    const response = await fetch(base_url + "/reviews/removeFromReviews", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: userId,
        movieId: testMovieId,
      }),
    });

    const data = await response.json();
    expect(response.status).to.equal(200);
    expect(data.message).to.equal("Review succesfully removed!");
  });

  it("should return an error if review does not exist", async () => {
    const invalidMovieId = 100;
    const response = await fetch(base_url + "/reviews/removeFromReviews", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: userId,
        movieId: invalidMovieId,
      }),
    });

    const data = await response.json();
    expect(response.status).to.equal(400);
    expect(data.error).to.equal("Review could not be removed.");
  });
});

// Tests for favorites
// Test for adding a favorite movie
describe("POST /favorites/addToFavorites", () => {
  const testMovieId = 99;
  const testMovieTitle = "Fake Movie Title";
  const testPosterPath = "/fakepath.jpg";
  const testGenres = [12, 28];
  const testReleaseDate = "2024-01-01";
  const testOverview = "This is a fake overview.";

  it("should successfully add a movie to favorites", async () => {
    const userId = 1;

    const response = await fetch(base_url + "/favorites/addToFavorites", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: userId,
        movieId: testMovieId,
        movieTitle: testMovieTitle,
        poster_path: testPosterPath,
        genres: testGenres,
        releaseDate: testReleaseDate,
        overview: testOverview
      }),
    });

    const data = await response.json();
    expect(response.status).to.equal(200);
    expect(data.message).to.equal("Movie added to favorites successfully!");
  });
});

// Test for getting favorites
describe("GET /favorites/getFavorites", () => {
  it("should return all favorite movies for the user", async () => {
    const response = await fetch(base_url + `/favorites/getFavorites?userId=1`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    expect(response.status).to.equal(200);
    expect(data).to.be.an("array");
    expect(data).to.have.length.greaterThan(0);
  });

  it("should return a 404 error if no favorites are found", async () => {
    const response = await fetch(base_url + `/favorites/getFavorites?userId=9999`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    expect(response.status).to.equal(404);
    expect(data.error).to.equal("Could not find favorites");
  });

});

// Test for deleting favorites
describe("GET /favorites/removeFromFavorites", () => {
  it("should delete a movie", async () => {
    const response = await fetch(base_url + `/favorites/removeFromFavorites`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: 1,
        movieId: 99,
      }),
    });

    const data = await response.json();

    expect(response.status).to.equal(200);
    expect(data.message).to.equal("Movie successfully removed from favorites!");
  });

  it("should return an error if the favorite doesnt exist", async () => {
    const response = await fetch(base_url + `/favorites/removeFromFavorites`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: 1,
        movieId: 9999,
      }),
    });

    const data = await response.json();

    expect(response.status).to.equal(400);
    expect(data.error).to.equal("Movie not found in favorites or could not be removed.");
  });

});