let currentTurn = 0;

function processScore(isAnswerCorrect, score) {
	if (isAnswerCorrect) {
		const currentPlayerScoreContainer = document.getElementById(
			`player${currentTurn}Score`
        );
        players[currentTurn].score = players[currentTurn].score + score;
		currentPlayerScoreContainer.innerHTML = players[currentTurn].score;
	} else {
		nextActivePlayer();
	}
}

function setPlayerScores() {
	const playerNameDisplayContainer = document.getElementById(
		'playerNameDisplayContainer'
	);

	const playerNameWidth = Math.floor(100 / Object.keys(players).length);

	for (let i = 0; i < Object.keys(players).length; i++) {
		const playerScoreContainer = document.createElement('div');
		const player = players[i];
        playerScoreContainer.innerHTML = `<span id="player${i}Name">${player.name}</span>: <span id="player${i}Score">${player.score}</span>`;
        
		playerScoreContainer.classList.add(`col-xs-${12/Object.keys(players).length}`);
        playerScoreContainer.classList.add('playerName');

		playerNameDisplayContainer.appendChild(playerScoreContainer);
	}

	displayActivePlayer();
}

function displayActivePlayer() {
	//Remove current active player
	const currentActivePlayer = document.querySelector('.activePlayer');
	if (currentActivePlayer) {
		currentActivePlayer.classList.remove('activePlayer');
	}
	//Add player active class to current active player
	document
		.querySelector(`#player${currentTurn}Name`)
		.classList.add('activePlayer');
}

function nextActivePlayer() {
	if (Object.keys(players).includes(currentTurn + 1 + '')) {
		currentTurn++;
	} else {
		currentTurn = 0;
	}
	displayActivePlayer();
}
