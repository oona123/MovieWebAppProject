import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import Search from "./pages/Search";
import Groups from "./pages/Groups";
import Group from "./pages/Group";
import Showtimes from "./pages/Showtimes";
import Authentication, { AuthenticationMode } from "./pages/Authentication";
import MovieDetails from "./pages/MovieDetails";
import Profile from "./pages/Profile";
import ProtectedRoute from "./components/ProtectedRoute";
import Container from "./components/Container";

export default function App() {
  return (
    <div>
      <Navbar />
      <Container>
        <Routes>
          <Route path="/" exact element={<Home />} />
          <Route path="/showtimes" element={<Showtimes />} />
          <Route path="/groups" element={<Groups />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/group/:id" element={<Group />} />
          </Route>
          <Route path="/search" element={<Search />} />
          <Route path="/group" element={<Group />} />
          <Route path="/movie/:id" element={<MovieDetails />} />
          <Route
            path="/login"
            element={<Authentication authenticationMode={AuthenticationMode.Login} />}
          />
          <Route
            path="/signup"
            element={<Authentication authenticationMode={AuthenticationMode.Register} />}
          />
          <Route element={<ProtectedRoute />}>
            <Route path="/profile" element={<Profile />} />
          </Route>
          <Route element={<ProtectedRoute />}>
            <Route path="/delete/" element={<Profile />} />
          </Route>
        </Routes>
      </Container>
    </div>
  );
}
