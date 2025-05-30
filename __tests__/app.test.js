const endpointsJson = require("../endpoints.json");
/* Set up your test imports here */
const request = require('supertest')
const db = require('../db/connection')
const seed = require('../db/seeds/seed')
const testData = require('../db/data/test-data/index')
const app = require('../app')
require('jest-sorted')
/* Set up your beforeEach & afterAll functions here */
beforeEach(()=>{
  return seed(testData)
})
afterAll(() => {
  return db.end()
})
describe("Error Handling General", () => {
  test("404: accessing a non-existant route", () => {
    return request(app)
    .get("/api/anothertopic")
    .expect(404)
    .then((response) => {
      expect(response.body).toEqual({msg: "Error Not Found"})
    })
  })
})
describe("GET /api", () => {
  test("200: Responds with an object detailing the documentation for each endpoint", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({body: {endpoints}}) => {
        expect(endpoints).toEqual(endpointsJson);
      });
  });
});
describe("GET /api/topics", () => {
  test("200: responds with an array containing all topics objects", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({body}) => {
        expect(body).toHaveLength(3)
        body.forEach((topic)=>{
          expect(topic).toMatchObject({
            description: expect.any(String),
            slug: expect.any(String)
          })
        })
      })
  })
})
describe("GET /api/articles/:article_id", () => {
  test("200: responds with article object to respective article_id", () => {
    return request(app)
    .get("/api/articles/1")
    .expect(200)
    .then(({body}) => {
      expect(body.article).toMatchObject({
        article_id: expect.any(Number),
        title: expect.any(String),
        topic: expect.any(String),
        author: expect.any(String),
        body: expect.any(String),
        created_at: expect.any(String),
        votes: expect.any(Number),
        article_img_url: expect.any(String),
        comment_count: expect.any(String)
      })
    })
  })
  test("404: When passed an article_id that doesn't exist", () => {
    return request(app)
    .get("/api/articles/1000")
    .expect(404)
    .then(({body}) => {
      expect(body).toEqual({msg: "No article found under article_id: 1000"})
    })
  })
  test("400: invalid article_id input", () => {
    return request(app)
    .get("/api/articles/hello")
    .expect(400)
    .then(({body}) => {
      expect(body).toEqual({msg: "Invalid input"})
    })
  })
})
describe("GET /api/articles", () => {
  test("200: responds with array of article objects", () => {
    return request(app)
    .get("/api/articles")
    .expect(200)
    .then(({body}) => {
      expect(body.articles).toHaveLength(13)
      body.articles.forEach((article) => {
        expect(article).toMatchObject({
          article_id: expect.any(Number),
          title: expect.any(String),
          topic: expect.any(String),
          author: expect.any(String),
          created_at: expect.any(String),
          votes: expect.any(Number),
          article_img_url: expect.any(String),
          comment_count: expect.any(String)
        })
      })
      expect(body.articles).toBeSortedBy('created_at',{descending: true})
    })
  })
})
describe("GET /api/articles/:article_id/comments", () => {
  test("200: responds with array of all comments for a given article_id by most recent", () => {
    return request(app)
    .get("/api/articles/1/comments")
    .expect(200)
    .then(({body}) => {
      expect(body.comments).toHaveLength(11)
      body.comments.forEach((comment) => {
        expect(comment).toMatchObject({
          comment_id: expect.any(Number),
          article_id: expect.any(Number),
          body: expect.any(String),
          author: expect.any(String),
          votes: expect.any(Number),
          created_at: expect.any(String)
        })
      })
      expect(body.comments).toBeSortedBy('created_at',{descending: true})
    })
  })
  test("404: When passed an article_id that doesn't exist", () => {
    return request(app)
    .get("/api/articles/1000/comments")
    .expect(404)
    .then(({body}) => {
      expect(body).toEqual({msg: "No article found under article_id: 1000"})
    })
  })
  test("404: When passed an article_id and no comments are found", () => {
    return request(app)
    .get("/api/articles/2/comments")
    .expect(404)
    .then(({body}) => {
      expect(body).toEqual({msg: "No comments found for article_id: 2"})
    })
  })
  test("400: invalid article_id input", () => {
    return request(app)
    .get("/api/articles/hello/comments")
    .expect(400)
    .then(({body}) => {
      expect(body).toEqual({msg: "Invalid input"})
    })
  })
})
describe("POST /api/articles/:article_id/comments", () => {
  test("201: responds with posted comment", () => {
    return request(app)
    .post("/api/articles/2/comments")
    .send({username: "icellusedkars", body: "this is the best thing I've read"})
    .expect(201)
    .then(({body}) => {
      expect(body.comment).toEqual({
        comment_id: expect.any(Number),
        article_id: 2,
        body: "this is the best thing I've read",
        votes: expect.any(Number),
        author: "icellusedkars",
        created_at: expect.any(String)
      })
    })
  })
  test("404: when article_id is invalid", () => {
    return request(app)
    .post("/api/articles/1000/comments")
    .send({username: "icellusedkars", body: "this is the best thing I've read"})
    .expect(404)
    .then(({body}) => {
      expect(body).toEqual({msg: "No article found under article_id: 1000"})
    })
  })
  test("400: invalid username", () => {
    return request(app)
    .post("/api/articles/2/comments")
    .send({username: "bestcoder", body: "this is the best thing I've read"})
    .expect(400)
    .then(({body}) => {
      expect(body).toEqual({msg: "Username invalid"})
    })
  })
  test("400: invalid comment", () => {
    return request(app)
    .post("/api/articles/2/comments")
    .send({username: "icellusedkars"})
    .expect(400)
    .then(({body}) => {
      expect(body).toEqual({msg: "Invalid: No input"})
    })
  })
  test("400: invalid username (no username supplied)", () => {
    return request(app)
    .post("/api/articles/2/comments")
    .send({body: "this is the best thing I've read"})
    .expect(400)
    .then(({body}) => {
      expect(body).toEqual({msg: "Invalid: No input"})
    })
  })
})
describe("PATCH /api/articles/:article_id", () => {
  test("200: responds with updated article", () => {
    return request(app)
    .patch("/api/articles/1")
    .send({ inc_votes : 10 })
    .expect(200)
    .then(({body}) => {
      expect(body.article.votes).toBe(110)
    })
  })
  test("404: when article_id is invalid", () => {
    return request(app)
    .patch("/api/articles/1000")
    .send({ inc_votes : 10 })
    .expect(404)
    .then(({body}) => {
      expect(body).toEqual({msg: "No article found under article_id: 1000"})
    })
  })
  test("400: invalid input", () => {
    return request(app)
    .patch("/api/articles/1")
    .send({})
    .expect(400)
    .then(({body}) => {
      expect(body).toEqual({msg: "Invalid: No input"})
    })
  })
  test("400: invalid input", () => {
    return request(app)
    .patch("/api/articles/1")
    .send({inc_votes: "ten"})
    .expect(400)
    .then(({body}) => {
      expect(body).toEqual({msg: "Invalid input"})
    })
  })
})
describe("DELETE /api/comments/:comment_id", () => {
  test("204: deletes comment by id and returns no content", () => {
    return db.query("INSERT INTO comments (article_id, body, author) VALUES (2, 'wow', 'icellusedkars') RETURNING *;")
    .then(()=>{
      return request(app)
      .delete("/api/comments/19")
      .expect(204)
    })
    .then(()=>{
      return db.query("SELECT * FROM comments WHERE comment_id = 19")
      .then(({rows})=>{
        expect(rows).toEqual([])
      })
    })
  })
  test("404: When passed an comment_id that doesn't exist", () => {
    return db.query("INSERT INTO comments (article_id, body, author) VALUES (2, 'wow', 'icellusedkars') RETURNING *;")
    .then(()=>{
      return request(app)
      .delete("/api/comments/1000")
      .expect(404)
      .then(({body}) => {
        expect(body).toEqual({msg: "No comment found under comment_id: 1000"})
      })
    })
  })
  test("400: When passed an comment_id that is invalid", () => {
    return db.query("INSERT INTO comments (article_id, body, author) VALUES (2, 'wow', 'icellusedkars') RETURNING *;")
    .then(()=>{
      return request(app)
      .delete("/api/comments/seven")
      .expect(400)
      .then(({body}) => {
        expect(body).toEqual({msg: "Invalid input"})
      })
    })
  })
})
describe("GET /api/users", () => {
  test("200: responds with array of article objects", () => {
    return request(app)
    .get("/api/users")
    .expect(200)
    .then(({body}) => {
      expect(body.users).toHaveLength(4)
      body.users.forEach((user) => {
        expect(user).toMatchObject({
          username: expect.any(String),
          name: expect.any(String),
          avatar_url: expect.any(String)
        })
      })
    })
  })
})
describe("GET /api/articles?sort_by=<>&order=<>", () => {
  test("200: responds with correct order by sort query", () => {
    return request(app)
    .get("/api/articles?sort_by=title&order=asc")
    .expect(200)
    .then(({body}) => {
      expect(body.articles).toBeSortedBy('title', {ascending: true})
    })
  })
  test("400: When passed a query that is invalid for sort by", () => {
    return request(app)
    .get("/api/articles?sort_by=hello")
    .expect(400)
    .then(({body}) => {
      expect(body).toEqual({msg: "Invalid input"})
    })
  })
  test("400: When passed a query that is invalid for order", () => {
    return request(app)
    .get("/api/articles?order=highest")
    .expect(400)
    .then(({body}) => {
      expect(body).toEqual({msg: "Invalid input"})
    })
  })
})
describe("GET /api/articles?topic=<>", () => {
  test("200: responds with all the topics queried", () => {
    return request(app)
    .get("/api/articles?topic=mitch")
    .expect(200)
    .then(({body}) => {
      expect(body.articles).toHaveLength(12)
      body.articles.forEach((article)=>{
        expect(article.topic).toBe("mitch")
      })
    })
  })
  test("404: When passed a topic query that doesn't exist on articles table", () => {
    return request(app)
    .get("/api/articles?topic=dogs")
    .expect(404)
    .then(({body}) => {
      expect(body).toEqual({msg: "No topic found for dogs"})
    })
  })
})
