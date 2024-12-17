import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import userRouter from "./routers/userRouter.js";
import favoritesRouter from "./routers/FavoritesRouter.js";
import groupsRouter from "./routers/groupsRouter.js";
import reviewRouter from "./routers/ReviewRouter.js";

dotenv.config();

const port = process.env.PORT;

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/user", userRouter);
app.use("/groups", groupsRouter);
app.use("/group", groupsRouter);
app.use("/favorites", favoritesRouter)
app.use("/reviews", reviewRouter);
//app.use("/share", shareRouter);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  console.error("An error occurred:", err);
  res.status(statusCode).json({ error: err.message });
});

app.listen(port, () => console.log(`Server running on port ${port}`));