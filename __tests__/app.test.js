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
      expect(body.article).toEqual({
        article_id: 1,
        title: 'Living in the shadow of a great man',
        topic: 'mitch',
        author: 'butter_bridge',
        body: 'I find this existence challenging',
        created_at: '2020-07-09T20:11:00.000Z',
        votes: 100,
        article_img_url: 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700',
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
  test("404: When passed an article_id and no comments are found", () => {
    return request(app)
    .get("/api/articles/1000/comments")
    .expect(404)
    .then(({body}) => {
      expect(body).toEqual({msg: "No comments found for article_id: 1000"})
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
