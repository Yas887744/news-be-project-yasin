const endpointsJson = require("../endpoints.json");
/* Set up your test imports here */
const request = require('supertest')
const db = require('../db/connection')
const seed = require('../db/seeds/seed')
const testData = require('../db/data/test-data/index')
const app = require('../app')
/* Set up your beforeEach & afterAll functions here */
beforeEach(()=>{
  return seed(testData)
})
afterAll(() => {
  return db.end()
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
describe("Error Handling", () => {
  test("404: accessing a non-existant route", () => {
    return request(app)
    .get("/api/anothertopic")
    .expect(404)
    .then((response) => {
      expect(response.body).toEqual({msg: "Error Not Found"})
    })
  })
})