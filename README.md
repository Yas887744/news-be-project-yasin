# NC News Seeding

## Hosted Link

https://news-be-project-yasin.onrender.com/api

This link will show you a JSON object of all available endpoints.

## Backend Project Summary

For the backend project I have successfully created and seeded a test and development database with 4 tables of `articles`, `users`, `comments` and `topics`.  
Then I set up a RESTful API hosted on render (link above).  
Parametric endopints were set up and complex queries were handled also. The happy paths and error paths were tested thoroughly.

## How to install correct dependencies

`npm install`

## How to create .env files

1. Create a .env.test file and a .env.development file in the main part of the directory.
2. Inside the .env.test file write PGDATABASE = nc_news_test
3. Inside the .env.development file write PGDATABASE = nc_news
4. This will allow you run my files and connect the the database successfully.
5. You can test that these run correctly and you are in the corect databse by typing `npm run setup-dbs` to create the test and development database locally then `npm run test-seed` to run test database and `npm run seed-dev` to run development database. You should see that it will say in the terminal connected to "the correct database".

## Minimum Versions needed to run project

Node.js: v23.9.0
Postgres: 14.17
