const questions = {
	qInternal: {},
	qListener: function (val) {},
	set q(val) {
		this.qInternal = val;
		this.qListener(val);
	},
	get q() {
		return this.qInternal;
	},
	registerListener: function (listener) {
		this.qListener = listener;
	},
};

//This will run each time questions updates
//Once all questions have been found it will
//display the game board
questions.registerListener(function (q) {
	if (Object.keys(q).length == 4) {
		let allQuestionsGathered = true;
		for (category of Object.keys(q)) {
			const qCategory = q[category];
			if (!qCategory.hard || !qCategory.easy || !qCategory.medium) {
				allQuestionsGathered = false;
			}
		}

		if (allQuestionsGathered) {
			displayQuestions(q);
		}
	}
});

function getCategories() {
	const cat = [];
	for (let i = 0; i <= 2; i++) {
		let categoryNumber = Math.floor(Math.random() * 23) + 9;
		while (cat.includes(categoryNumber)) {
			categoryNumber = Math.floor(Math.random() * 23) + 9;
		}
		cat.push(categoryNumber);
	}
	cat.push('any');
	return cat;
}

const categories = getCategories();
for (category of categories) {
	const questionDifficulty = { easy: 2, medium: 2, hard: 1 };

	for (difficulty of Object.keys(questionDifficulty)) {
		const amount = questionDifficulty[difficulty];
		const url = getUrl(amount, category, difficulty);

		fetch(url)
			.then((res) => {
				return res.json();
			})
			.then((res) => {
				let categoryName = url.includes('category')
					? res.results[0].category
					: 'Potpourri';

				const q = questions.q;
				if (!q[categoryName]) {
					q[categoryName] = {};
				}

				q[categoryName][res.results[0].difficulty] = res.results;

				questions.q = q;
			})
			.catch((err) => {
				console.log('something went wrong...', err);
			});
	}
}

function getUrl(amount, category, difficulty) {
	let url = `https://opentdb.com/api.php?amount=${amount}&difficulty=${difficulty}&type=multiple`;

	if (category != 'any') {
		url = url + `&category=${category}`;
	}
	return url;
}

function displayQuestions(questions) {
	const columnsByCategory = getColumnsByCategory(questions);
	for (columnNumber of Object.keys(columnsByCategory)) {
		document.querySelector(`#columnHeader${columnNumber}`).innerHTML =
			columnsByCategory[columnNumber];
	}

	for (column of Object.keys(columnsByCategory)) {
		const questionByColumnNumber = questions[columnsByCategory[column]];
		for (difficuly of Object.keys(questionByColumnNumber)) {
			setQuestions(questionByColumnNumber[difficuly], column, difficuly);
		}
	}
}

function getColumnsByCategory(questions) {
	let columnCounter = 0;
	const columnsByCategory = {};
	for (category of Object.keys(questions)) {
		columnsByCategory[columnCounter] = category;
		columnCounter++;
	}
	return columnsByCategory;
}

function setQuestions(questions, column, difficultly) {
	const difficultlyOffset = getDifficultlyOffset(difficultly);

	for (let i = 0; i < questions.length; i++) {
		const questionRow = document.getElementById(
			`questionRow${i + difficultlyOffset}`
		);

		let questionButton;
		const rowChildren = questionRow.childNodes;
		for (rowChild of rowChildren) {
			if (rowChild.id && rowChild.id == `question${column}`) {
				questionButton = rowChild;
			}
		}

		if (questionButton) {
			const score = getScore(i, difficultly);
			questionButton.addEventListener('click', function () {
				displayModule(questions[i], questionButton, score);
			});
		}
	}
}

function getScore(index, difficultly) {
	const scoreDifficultlyOffset = {
		easy: 100,
		medium: 300,
		hard: 500,
	};
	return index * 100 + scoreDifficultlyOffset[difficultly];
}

function getDifficultlyOffset(difficultly) {
	if (difficultly == 'easy') {
		return 0;
	} else if (difficultly == 'medium') {
		return 2;
	} else {
		return 4;
	}
}

const span = document.getElementsByClassName('close')[0];
span.onclick = function () {
	document.getElementById('questionModal').style.display = 'none';
	for (let i = 0; i < 4; i++) {
		//Remove all active event listeners by cloning node
		const oldAnswerButton = getAnswerButtonByIndex(i);
		const newAnswerButton = oldAnswerButton.cloneNode(true);
		oldAnswerButton.parentNode.replaceChild(newAnswerButton, oldAnswerButton);
		newAnswerButton.disabled = false;
		newAnswerButton.classList.remove('wrongAnswer');
		newAnswerButton.classList.remove('rightAnswer');
	}
};

function displayModule(question, questionButton, score) {
	const modal = document.getElementById('questionModal');
	modal.style.display = 'block';

	const modalHeader = document.getElementById('modal-category-header');
	modalHeader.innerText = question.category;

	const modalQuestion = document.getElementById('model-question');
	modalQuestion.innerText = question.question;

	let answerChoicesArray = question.incorrect_answers;
	answerChoicesArray.push(question.correct_answer);
	answerChoicesArray = shuffleArray(answerChoicesArray);

	for (let i = 0; i < answerChoicesArray.length; i++) {
		const answerButton = getAnswerButtonByIndex(i);
		answerButton.innerText = answerChoicesArray[i];
		answerButton.addEventListener('click', function () {
			answerPicked(
				answerChoicesArray[i],
				question.correct_answer,
				i,
				questionButton,
				score
			);
		});
	}
}

function shuffleArray(array) {
	var currentIndex = array.length,
		temporaryValue,
		randomIndex;

	// While there remain elements to shuffle...
	while (0 !== currentIndex) {
		// Pick a remaining element...
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex -= 1;

		// And swap it with the current element.
		temporaryValue = array[currentIndex];
		array[currentIndex] = array[randomIndex];
		array[randomIndex] = temporaryValue;
	}

	return array;
}

function answerPicked(
	answer,
	correctAnswer,
	buttonClickedIndex,
	questionButton,
	score
) {
	const isAnswerCorrect = answer == correctAnswer;
	for (let i = 0; i < 4; i++) {
		const answerButton = getAnswerButtonByIndex(i);
		if (i == buttonClickedIndex) {
			answerButton.classList.add(
				isAnswerCorrect ? 'rightAnswer' : 'wrongAnswer'
			);
		}

		if (!isAnswerCorrect && answerButton.innerText == correctAnswer) {
			answerButton.classList.add('rightAnswer');
		}
		answerButton.disabled = true;
    }
    questionButton.disabled = true;

    processScore(isAnswerCorrect, score);
}

function getAnswerButtonByIndex(index) {
	return document.getElementById(`answer${index}`);
}

function processScore(isAnswerCorrect, score){
    console.log(isAnswerCorrect);
    console.log(score);
}
