const express = require("express");
const cors = require("cors");
const app = express();
const {
  getApi,
  getTopics,
  getArticleById,
  getArticles,
  getComments,
  postComment,
  patchArticle,
  deleteComment,
  getUsers,
} = require("./controller");
app.use(cors());
app.use(express.json());

app.get("/api", getApi);
app.get("/api/topics", getTopics);
app.get("/api/articles/:article_id", getArticleById);
app.get("/api/articles", getArticles);
app.get("/api/articles/:article_id/comments", getComments);
app.post("/api/articles/:article_id/comments", postComment);
app.patch("/api/articles/:article_id", patchArticle);
app.delete("/api/comments/:comment_id", deleteComment);
app.get("/api/users", getUsers);

app.use((err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
});
app.use((err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "Invalid input" });
  } else {
    next(err);
  }
});
app.use((err, req, res, next) => {
  if (err.code === "23503") {
    res.status(400).send({ msg: "Username invalid" });
  } else {
    next(err);
  }
});
app.use((err, req, res, next) => {
  if (err.code === "23502") {
    res.status(400).send({ msg: "Invalid: No input" });
  } else {
    next(err);
  }
});
app.all("/*splat", (req, res) => {
  res.status(404).send({ msg: "Error Not Found" });
});

module.exports = app;
