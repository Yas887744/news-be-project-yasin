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
      .then((response) => {
        expect(response.body).toEqual(endpointsJson);
      });
  });
});
describe("GET /api/topics", () => {
  test("200: responds with an array containing all topics objects", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then((response) => {
        //console.log(response.body, "body for api/topics")
        expect(response.body).toEqual([
          {
            description: 'The man, the Mitch, the legend',
            slug: 'mitch',
            img_url: ""
          },
          {
            description: 'Not dogs',
            slug: 'cats',
            img_url: ""
          },
          {
            description: 'what books are made of',
            slug: 'paper',
            img_url: ""
          }
        ])
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