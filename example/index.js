function result(msg) {
	const body = document.querySelector('body');
	body.textContent = msg;
}

if ('serviceWorker' in navigator) {
	navigator.serviceWorker.register('sw.js').then(reg => {
		result(`Registration succeeded. Scope is ${reg.scope}`);
	}).catch(err => {
		result(`Registration failed with ${err.toString()}`);
	});
}
