let inDevMode = false;
let devShowFinalScreen = false;

setDevPlayerNames();

function setDevPlayerNames() {
	if (inDevMode) {
		document.getElementById('player0Input').value = 'foo';
		document.getElementById('player1Input').value = 'bar';

		//Trigger playerNameSubmitButton click event
		const evObj = document.createEvent('Events');
		evObj.initEvent('click', true, false);
		playerNameSubmitButton.dispatchEvent(evObj);
	}
}
