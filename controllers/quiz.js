const getRandomNumber = (length) => {
	const random = Math.floor(Math.random() * length);
	if (random <= length - 3 && random !== undefined) {
		return random;
	} else {
		getRandomNumber(length);
	}
};

// Fisher-Yates shuffle algorithm
const shuffle = (array) => {
	for (let i = array.length - 1; i > 0; i--) {
		let j = Math.floor(Math.random() * (i + 1));
		[array[i], array[j]] = [array[j], array[i]];
	}
	return array;
};

const transformData = (data, category) => {
	//Transform data for the client
	const shuffledData = shuffle(data);
	const slicedData = shuffledData.slice(0, 5);

	return slicedData.map((country, index) => {
		const randomNumber = getRandomNumber(data.length);

		const otherOptions = shuffledData
			.slice(randomNumber, randomNumber + 3)
			.map((country) => country.name.common); //Get other 3 random options
		const options = shuffle([...otherOptions, country.name.common]);

		return category === "capital"
			? {
					id: index,
					question: `${country.capital} is the capital of?`,
					options,
					answer: country.name.common,
			  }
			: {
					id: index,
					question: `Which country does this flag belong to?`,
					options,
					answer: country.name.common,
					flag_link: country.flags.svg,
			  };
	});
};

const getQuiz = (axios, redisClient) => (req, res) => {
	console.log("Fetching data from origin");
	const category = req.params.category;

	axios
		.get("https://restcountries.com/v3.1/all")
		.then((response) => {
			//Store data to redis
			const ONE_DAY_EXPIRATION = 86400;
			redisClient.set(req.route.path, JSON.stringify(response.data));
			redisClient.expire(req.route.path, ONE_DAY_EXPIRATION);
			const transformedData = transformData(response.data, category);

			res.status(200).json(transformedData);
		})
		.catch((err) => {
			console.log("Error fetching from origin");
			res.status(400).json(err);
		});
};

module.exports = {
	getQuiz: getQuiz,
	transformData: transformData,
};
