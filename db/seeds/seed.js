const db = require("../connection")
const format = require("pg-format")
const { convertTimestampToDate } = require("./utils.js")
const { createRef } = require("./utils.js")
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
      title VARCHAR(200) NOT NULL,
      topic VARCHAR(100) REFERENCES topics(slug),
      author VARCHAR(250) REFERENCES users(username),
      body TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
      votes INT DEFAULT 0 NOT NULL, 
      article_img_url VARCHAR(1000) NOT NULL);`)
    })
    .then(() => {
      return db.query(`CREATE TABLE comments(
      comment_id SERIAL PRIMARY KEY,
      article_id INT REFERENCES articles(article_id),
      body TEXT NOT NULL,
      votes INT DEFAULT 0 NOT NULL,
      author VARCHAR(250) REFERENCES users(username),
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
        VALUES %L RETURNING *`, formattedUsersData)
        return db.query(insertUserData)
    })
    .then(() => {
      const formattedArticlesData = articleData.map((articles) => {
        const correctTimeData = convertTimestampToDate(articles)
        return [
          correctTimeData.title,
          correctTimeData.topic,
          correctTimeData.author, 
          correctTimeData.body,
          correctTimeData.created_at,
          correctTimeData.votes,
          correctTimeData.article_img_url
        ]
      })
      //console.log(formattedArticlesData, "<<<<<<")
      const insertArticleData = format(`INSERT INTO articles(title,
         topic, author, body, created_at, votes, article_img_url)
        VALUES %L RETURNING *`, formattedArticlesData)
      return db.query(insertArticleData)
    })
    .then((result) => {
      //console.log(result.rows)
      const articlesRefObj = createRef(result.rows)
      //console.log(articlesRefObj, ">>>> article title")
      const commentDataCorrectTime = commentData.map((comments) => convertTimestampToDate(comments))
      const formattedCommentsData = commentDataCorrectTime.map((comments) => {
        return [
          articlesRefObj[comments.article_title],
          comments.body, 
          comments.author, 
          comments.votes,
          comments.created_at
        ]
      })
      //console.log(formattedCommentsData, "formatted comments data")
      const insertCommentData = format(`INSERT INTO comments(article_id, body, author, votes, created_at)
        VALUES %L RETURNING *`, formattedCommentsData)

      return db.query(insertCommentData)
    })
    // .then((result)=>{
    //   console.log(result.rows)
    // })
    .then(()=>{
      console.log("Seed complete")
    })
};
module.exports = seed;
