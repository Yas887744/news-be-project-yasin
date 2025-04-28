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