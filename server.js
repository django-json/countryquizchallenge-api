const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const axios = require("axios");
const redis = require("redis");

// Controllers
const quiz = require("./controllers/quiz");

//Require dotenv in development mode
if (process.env.NODE_ENV !== "production") require("dotenv").config();

const app = express();
const port = process.env.PORT || 3001;
const redisClient = redis.createClient({ host: "127.0.0.1" });

//Middlewares
const cache = require("./middleware/cache");
app.use(bodyParser.json());
app.use(cors());

//Routes
app.get("/", (req, res) => {
	res.send("Hello World");
});

app.get(
	"/api/quiz/:category",
	cache.getQuiz(redisClient),
	quiz.getQuiz(axios, redisClient)
);

//Listening
app.listen(port, (error) => {
	if (error) throw error;
	console.log(`App is running on port ${process.env.PORT}`);
});
