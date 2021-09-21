const quiz = require("../controllers/quiz");

const getQuiz = (redisClient) => (req, res, next) => {
	const key = req.route.path;
	const category = req.params.category;

	redisClient.get(key, (err, reply) => {
		if (err || !reply) {
			console.log("No record from cache to retrieve");
		}
		if (reply !== null) {
			console.log("Fetching data from cache");
			const transformedData = quiz.transformData(
				JSON.parse(reply),
				category
			);

			res.status(200).json(transformedData);
			// console.log(JSON.parse(reply));
		} else {
			next();
		}
	});
};

module.exports = {
	getQuiz: getQuiz,
};
