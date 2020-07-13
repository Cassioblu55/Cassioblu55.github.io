const players = {};
let activePlayer;

const numberOfPlayersSelector = document.getElementById(
	'numberOfPlayersSelector'
);

const playerNameSubmitButton = document.getElementById(
	'playerNameSubmitButton'
);

numberOfPlayersSelector.addEventListener('change', updatePlayerInput);

updatePlayerInput();
function updatePlayerInput() {
	const numberOfPlayers =
		numberOfPlayersSelector.options[numberOfPlayersSelector.selectedIndex]
			.value;

	const playerNameContainer = document.getElementById('playerNameContainer');
	playerNameContainer.innerHTML = '';
	for (let i = 0; i < numberOfPlayers; i++) {
		const row = document.createElement('div');
		row.classList.add('row');
		row.classList.add('playerNameInputRow');
		playerNameContainer.appendChild(row);

		const label = document.createElement('label');
		label.setAttribute('for', `player${i}Input`);
		label.innerHTML = `Player ${i + 1} name:`;
		row.appendChild(label);

		const input = document.createElement('input');
		input.setAttribute('id', `player${i}Input`);
		input.classList.add('playerNameInput');
		input.addEventListener('change', playerNameEntered);
		row.appendChild(input);
	}
	playerNameEntered();
}

function playerNameEntered() {
	const workingPlayerNames = [];
	let invalidWorkingPlayerNames = false;
	for (playerName of getWorkingPlayerNames()) {
		if (playerName == '' || workingPlayerNames.includes(playerName)) {
			invalidWorkingPlayerNames = true;
		}
		workingPlayerNames.push(playerName);
	}
	disablePlayerNameSubmitButton(invalidWorkingPlayerNames);
}

function getWorkingPlayerNames() {
	const workingPlayerNameArray = [];
	for (playerInput of document.querySelectorAll('.playerNameInput')) {
		workingPlayerNameArray.push(playerInput.value);
	}
	return workingPlayerNameArray;
}

function disablePlayerNameSubmitButton(isInvalid) {
	playerNameSubmitButton.disabled = isInvalid;
}

playerNameSubmitButton.addEventListener('click', function () {
	const workingPlayerNames = getWorkingPlayerNames();
	for (let i = 0; i < workingPlayerNames.length; i++) {
		const playerName = workingPlayerNames[i];
		players[i] = { name: playerName, score: 0 };
	}
	setPlayerScores();

	document.getElementById('playerSelectModal').style.display = 'none';
});
