# NC News Seeding

-Create a .env.test file and a .env.development file in the main part of the directory.
-Inside the .env.test file write PGDATABASE = nc_news_test
-Inside the .env.development file write PGDATABASE = nc_news
-This will allow you run my files and connect the the database successfully.
-You can test that these run correctly and you are in the corect databse by typing npm run test-seed and npm run seed-dev. You should see that it will say in the terminal connected to "the correct database".
