const {
  convertTimestampToDate,
  createRef
} = require("../db/seeds/utils");

describe("convertTimestampToDate", () => {
  test("returns a new object", () => {
    const timestamp = 1557572706232;
    const input = { created_at: timestamp };
    const result = convertTimestampToDate(input);
    expect(result).not.toBe(input);
    expect(result).toBeObject();
  });
  test("converts a created_at property to a date", () => {
    const timestamp = 1557572706232;
    const input = { created_at: timestamp };
    const result = convertTimestampToDate(input);
    expect(result.created_at).toBeDate();
    expect(result.created_at).toEqual(new Date(timestamp));
  });
  test("does not mutate the input", () => {
    const timestamp = 1557572706232;
    const input = { created_at: timestamp };
    convertTimestampToDate(input);
    const control = { created_at: timestamp };
    expect(input).toEqual(control);
  });
  test("ignores includes any other key-value-pairs in returned object", () => {
    const input = { created_at: 0, key1: true, key2: 1 };
    const result = convertTimestampToDate(input);
    expect(result.key1).toBe(true);
    expect(result.key2).toBe(1);
  });
  test("returns unchanged object if no created_at property", () => {
    const input = { key: "value" };
    const result = convertTimestampToDate(input);
    const expected = { key: "value" };
    expect(result).toEqual(expected);
  });
});
describe("createRef", () => {
  test("returns empty object when given empty array", ()=>{
    const input = []
    const result = createRef(input)
    expect(result).toEqual({})
  })
  test("array of one object returns object with title and id", () =>{
    const input = [{
      article_id: 12,
      title: 'Moustache',
      topic: 'mitch',
      author: 'butter_bridge',
      body: 'Have you seen the size of that thing?',
      created_at: '2020-10-11T11:24:00.000Z',
      votes: 0,
      article_img_url: 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700'
    }]
    const result = createRef(input)
    expect(result).toEqual({"Moustache": 12})
  })
  test("array of multiple objects returns object with titles and id's", () =>{
    const input = [{
      article_id: 12,
      title: 'Moustache',
      topic: 'mitch',
      author: 'butter_bridge',
      body: 'Have you seen the size of that thing?',
      created_at: '2020-10-11T11:24:00.000Z',
      votes: 0,
      article_img_url: 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700'
    },
    {
      article_id: 13,
      title: 'Another article about Mitch',
      topic: 'mitch',
      author: 'butter_bridge',
      body: 'There will never be enough articles about Mitch!',
      created_at: '2020-10-11T11:24:00.000Z',
      votes: 0,
      article_img_url: 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700'
    }]
    const result = createRef(input)
    expect(result).toEqual({"Moustache": 12,
      "Another article about Mitch": 13
    })
  })
  test("test for mutation", ()=>{
    const input = [{
      article_id: 12,
      title: 'Moustache',
      topic: 'mitch',
      author: 'butter_bridge',
      body: 'Have you seen the size of that thing?',
      created_at: '2020-10-11T11:24:00.000Z',
      votes: 0,
      article_img_url: 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700'
    }]
    createRef(input)
    expect(input).toEqual([{
      article_id: 12,
      title: 'Moustache',
      topic: 'mitch',
      author: 'butter_bridge',
      body: 'Have you seen the size of that thing?',
      created_at: '2020-10-11T11:24:00.000Z',
      votes: 0,
      article_img_url: 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700'
    }])
  })

})
