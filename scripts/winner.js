function displayWinScreen() {
	const questionModel = document.getElementById('questionModal');
	questionModel.style.display = 'none';

	const winnerModal = document.getElementById('winnerModal');
	winnerModal.style.display = 'block';

	const winnerOrder = getWinnerOrder();
	for (let i = 0; i < winnerOrder.length; i++) {
		const winner = winnerOrder[i];
		const winnerContainer = document.getElementById(`winner${i}`);
		winnerContainer.innerText = `${winner.name} ${winner.score}`;

		if (i == 2 || i == 3) {
			winnerContainer.parentElement.style.display = 'block';
		}
	}
}

function getWinnerOrder() {
	const playerSortableArray = [];
	for (playerTurnOrder of Object.keys(players)) {
		playerSortableArray.push(players[playerTurnOrder]);
	}

	return playerSortableArray.sort(function (a, b) {
		return Number(b.score) - Number(a.score);
	});
}
