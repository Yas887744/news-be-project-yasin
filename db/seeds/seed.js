const db = require("../connection")
const format = require("pg-format")
const { convertTimestampToDate } = require("./utils.js")
const seed = ({ topicData, userData, articleData, commentData }) => {
  return db
    .query(`DROP TABLE IF EXISTS comments`)
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS articles`)
    })
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS users`)
    }) 
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS topics`)
    })
    .then(() => {
      return db.query(`CREATE TABLE topics(
      slug VARCHAR(100) PRIMARY KEY,
      description VARCHAR(500) NOT NULL,
      img_url VARCHAR(1000) NOT NULL);`)
    })
    .then(() => {
      return db.query(`CREATE TABLE users(
      username VARCHAR(250) PRIMARY KEY,
      name VARCHAR(500) NOT NULL,
      avatar_url VARCHAR(1000) NOT NULL);`)
    }) 
    .then(() => {
      return db.query(`CREATE TABLE articles(
      article_id SERIAL PRIMARY KEY,
      title VARCHAR(200),
      topic VARCHAR(100),
      FOREIGN KEY (topic) REFERENCES topics(slug),
      author VARCHAR(250),
      FOREIGN KEY (author) REFERENCES users(username),
      body TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      votes INT DEFAULT 0, 
      article_img_url VARCHAR(1000));`)
    })
    .then(() => {
      return db.query(`CREATE TABLE comments(
      comment_id SERIAL PRIMARY KEY,
      article_id INT, 
      FOREIGN KEY (article_id) REFERENCES articles(article_id),
      body TEXT,
      votes INT DEFAULT 0,
      author VARCHAR(250),
      FOREIGN KEY(author) REFERENCES users(username),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);`) 
    })
    .then(() => {
      //console.log(topicData, "topic data")
      const formattedTopicData = topicData.map((topics) => {
        return [topics.slug, topics.description, topics.img_url]
      })
      //console.log(formattedTopicData, "<<<<<<")
      const insertTopicData = format(`INSERT INTO topics(slug, description, img_url)
        VALUES %L`, formattedTopicData)
      return db.query(insertTopicData)
    })
    .then(() => {
      const formattedUsersData = userData.map((users) => {
        return [users.username, users.name, users.avatar_url]
      })
      const insertUserData = format(`INSERT INTO users(username, name, avatar_url) 
        VALUES %L`, formattedUsersData)
        return db.query(insertUserData)
    })
    .then(() => {
      const formattedArticlesData = articleData.map((articles) => {
        return [
          articles.title,
          articles.topic,
          articles.author, 
          articles.body,
          articles.votes,
          articles.article_img_url
        ]
      })
      const insertArticleData = format(`INSERT INTO articles(title, topic, author, body, votes, article_img_url)
        VALUES %L`, formattedArticlesData)
      return db.query(insertArticleData)
    })
    .then(() => {
      const commentDataCorrectTime = commentData.map((comments) => convertTimestampToDate(comments))
      const formattedCommentsData = commentDataCorrectTime.map((comments) => {
        return [
          comments.body, 
          comments.article_id, 
          comments.author, 
          comments.votes,
          comments.created_at
        ]
      })
      //console.log(formattedCommentsData, "formatted comments data")
      const insertCommentData = format(`INSERT INTO comments(body, article_id, author, votes, created_at)
        VALUES %L`, formattedCommentsData)

      return db.query(insertCommentData)
    })
};
module.exports = seed;
